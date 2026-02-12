import type { Knex } from 'knex';
import type { ErrorSchema } from '../../utils/app.error';

interface ModelOpts {
  db: Knex;
  Error: ErrorSchema;
}

const createInterestModel = (opts: ModelOpts) => {
  const { db, Error } = opts;

  // Send interest
  const send = async (senderProfileId: string, receiverProfileId: string, message?: string) => {
    // Prevent duplicate and self-interest
    if (senderProfileId === receiverProfileId) throw Error.badRequest('Cannot send interest to self');
    const exists = await db('interests').where({ sender_profile_id: senderProfileId, receiver_profile_id: receiverProfileId }).first();
    if (exists) throw Error.badRequest('Interest already sent');
    const [interest] = await db('interests').insert({
      sender_profile_id: senderProfileId,
      receiver_profile_id: receiverProfileId,
      status: 'pending',
      message,
      sent_at: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    }, ['id']);
    return { interest_id: interest.id };
  };

  // Get interests I sent
  const getSent = async (profileId: string) => {
    return db('interests').where({ sender_profile_id: profileId }).orderBy('created_at', 'desc');
  };

  // Get interests I received
  const getReceived = async (profileId: string) => {
    return db('interests').where({ receiver_profile_id: profileId }).orderBy('created_at', 'desc');
  };

  // Accept interest
  const accept = async (interestId: string, receiverProfileId: string) => {
    const updated = await db('interests').where({ id: interestId, receiver_profile_id: receiverProfileId }).update({ status: 'accepted', responded_at: new Date(), updated_at: new Date() });
    if (!updated) throw Error.notFound('Interest not found');
    return { success: true };
  };

  // Reject interest
  const reject = async (interestId: string, receiverProfileId: string, reason?: string) => {
    const updated = await db('interests').where({ id: interestId, receiver_profile_id: receiverProfileId }).update({ status: 'rejected', responded_at: new Date(), rejection_reason: reason, updated_at: new Date() });
    if (!updated) throw Error.notFound('Interest not found');
    return { success: true };
  };

  // Ask question before accepting
  const askQuestion = async (interestId: string, askedByProfileId: string, questionText: string) => {
    // Only one question per interest
    const exists = await db('interest_questions').where({ interest_id: interestId }).first();
    if (exists) throw Error.badRequest('Question already asked');
    await db('interest_questions').insert({
      interest_id: interestId,
      asked_by_profile_id: askedByProfileId,
      question_text: questionText,
      asked_at: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    });
    return { success: true };
  };

  // Answer question
  const answerQuestion = async (interestId: string, answerText: string) => {
    const updated = await db('interest_questions').where({ interest_id: interestId }).update({ answer_text: answerText, answered_at: new Date(), updated_at: new Date() });
    if (!updated) throw Error.notFound('Question not found');
    return { success: true };
  };

  // Withdraw sent interest
  const withdraw = async (interestId: string, senderProfileId: string) => {
    const deleted = await db('interests').where({ id: interestId, sender_profile_id: senderProfileId, status: 'pending' }).del();
    if (!deleted) throw Error.notFound('Interest not found or cannot withdraw');
    return { success: true };
  };

  // Get interest details
  const getById = async (interestId: string, profileId: string) => {
    // Only sender or receiver can view
    const interest = await db('interests').where({ id: interestId }).andWhere(function() {
      this.where('sender_profile_id', profileId).orWhere('receiver_profile_id', profileId);
    }).first();
    if (!interest) throw Error.notFound('Interest not found');
    return interest;
  };

  return {
    send,
    getSent,
    getReceived,
    accept,
    reject,
    askQuestion,
    answerQuestion,
    withdraw,
    getById,
  };
};

export type InterestModelSchema = ReturnType<typeof createInterestModel>;
export default createInterestModel;
