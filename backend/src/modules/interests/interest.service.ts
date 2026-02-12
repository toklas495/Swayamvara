import type { InterestModelSchema } from './interest.model';
import type { ErrorSchema } from '../../utils/app.error';

interface ServiceOpts {
  Model: InterestModelSchema;
  Error: ErrorSchema;
}

const createInterestService = (opts: ServiceOpts) => {
  const { Model, Error } = opts;

  const send = async (senderProfileId: string, receiverProfileId: string, message?: string) => {
    return Model.send(senderProfileId, receiverProfileId, message);
  };

  const getSent = async (profileId: string) => {
    return Model.getSent(profileId);
  };

  const getReceived = async (profileId: string) => {
    return Model.getReceived(profileId);
  };

  const accept = async (interestId: string, receiverProfileId: string) => {
    return Model.accept(interestId, receiverProfileId);
  };

  const reject = async (interestId: string, receiverProfileId: string, reason?: string) => {
    return Model.reject(interestId, receiverProfileId, reason);
  };

  const askQuestion = async (interestId: string, askedByProfileId: string, questionText: string) => {
    return Model.askQuestion(interestId, askedByProfileId, questionText);
  };

  const answerQuestion = async (interestId: string, answerText: string) => {
    return Model.answerQuestion(interestId, answerText);
  };

  const withdraw = async (interestId: string, senderProfileId: string) => {
    return Model.withdraw(interestId, senderProfileId);
  };

  const getById = async (interestId: string, profileId: string) => {
    return Model.getById(interestId, profileId);
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

export type InterestServiceSchema = ReturnType<typeof createInterestService>;
export default createInterestService;
