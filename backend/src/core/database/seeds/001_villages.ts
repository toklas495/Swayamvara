import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Delete existing entries
  await knex('villages').del();

  // Insert Maharashtra villages grouped by Taluka (Pune District focus)
  await knex('villages').insert([
    // Baramati Taluka
    { taluka: 'Baramati', village_name: 'Morgaon', district: 'Pune', state: 'Maharashtra' },
    { taluka: 'Baramati', village_name: 'Phaltan', district: 'Pune', state: 'Maharashtra' },
    { taluka: 'Baramati', village_name: 'Jejuri', district: 'Pune', state: 'Maharashtra' },
    { taluka: 'Baramati', village_name: 'Bhigwan', district: 'Pune', state: 'Maharashtra' },
    { taluka: 'Baramati', village_name: 'Supa', district: 'Pune', state: 'Maharashtra' },
    { taluka: 'Baramati', village_name: 'Malshiras', district: 'Pune', state: 'Maharashtra' },
    { taluka: 'Baramati', village_name: 'Kedgaon', district: 'Pune', state: 'Maharashtra' },
    { taluka: 'Baramati', village_name: 'Yavat', district: 'Pune', state: 'Maharashtra' },

    // Indapur Taluka
    { taluka: 'Indapur', village_name: 'Indapur', district: 'Pune', state: 'Maharashtra' },
    { taluka: 'Indapur', village_name: 'Nimgaon Ketki', district: 'Pune', state: 'Maharashtra' },
    { taluka: 'Indapur', village_name: 'Bhigwan', district: 'Pune', state: 'Maharashtra' },
    { taluka: 'Indapur', village_name: 'Akluj', district: 'Pune', state: 'Maharashtra' },
    { taluka: 'Indapur', village_name: 'Kurkumb', district: 'Pune', state: 'Maharashtra' },

    // Purandar Taluka
    { taluka: 'Purandar', village_name: 'Saswad', district: 'Pune', state: 'Maharashtra' },
    { taluka: 'Purandar', village_name: 'Narayanpur', district: 'Pune', state: 'Maharashtra' },
    { taluka: 'Purandar', village_name: 'Jejuri', district: 'Pune', state: 'Maharashtra' },
    { taluka: 'Purandar', village_name: 'Walhe', district: 'Pune', state: 'Maharashtra' },

    // Daund Taluka
    { taluka: 'Daund', village_name: 'Daund', district: 'Pune', state: 'Maharashtra' },
    { taluka: 'Daund', village_name: 'Patas', district: 'Pune', state: 'Maharashtra' },
    { taluka: 'Daund', village_name: 'Yavat', district: 'Pune', state: 'Maharashtra' },
    { taluka: 'Daund', village_name: 'Kurkundi', district: 'Pune', state: 'Maharashtra' },

    // Haveli Taluka
    { taluka: 'Haveli', village_name: 'Pune City', district: 'Pune', state: 'Maharashtra' },
    { taluka: 'Haveli', village_name: 'Khadki', district: 'Pune', state: 'Maharashtra' },
    { taluka: 'Haveli', village_name: 'Lohegaon', district: 'Pune', state: 'Maharashtra' },
    { taluka: 'Haveli', village_name: 'Wagholi', district: 'Pune', state: 'Maharashtra' },
    { taluka: 'Haveli', village_name: 'Undri', district: 'Pune', state: 'Maharashtra' },
    { taluka: 'Haveli', village_name: 'Hadapsar', district: 'Pune', state: 'Maharashtra' },

    // Shirur Taluka
    { taluka: 'Shirur', village_name: 'Shirur', district: 'Pune', state: 'Maharashtra' },
    { taluka: 'Shirur', village_name: 'Kendur', district: 'Pune', state: 'Maharashtra' },
    { taluka: 'Shirur', village_name: 'Ranjangaon', district: 'Pune', state: 'Maharashtra' },
    { taluka: 'Shirur', village_name: 'Nhavi', district: 'Pune', state: 'Maharashtra' },

    // Maval Taluka
    { taluka: 'Maval', village_name: 'Talegaon Dabhade', district: 'Pune', state: 'Maharashtra' },
    { taluka: 'Maval', village_name: 'Lonavala', district: 'Pune', state: 'Maharashtra' },
    { taluka: 'Maval', village_name: 'Kamshet', district: 'Pune', state: 'Maharashtra' },
    { taluka: 'Maval', village_name: 'Vadgaon Maval', district: 'Pune', state: 'Maharashtra' },

    // Mulshi Taluka
    { taluka: 'Mulshi', village_name: 'Paud', district: 'Pune', state: 'Maharashtra' },
    { taluka: 'Mulshi', village_name: 'Pirangut', district: 'Pune', state: 'Maharashtra' },
    { taluka: 'Mulshi', village_name: 'Lavasa', district: 'Pune', state: 'Maharashtra' },

    // Bhor Taluka
    { taluka: 'Bhor', village_name: 'Bhor', district: 'Pune', state: 'Maharashtra' },
    { taluka: 'Bhor', village_name: 'Nasarapur', district: 'Pune', state: 'Maharashtra' },
    { taluka: 'Bhor', village_name: 'Khatav', district: 'Pune', state: 'Maharashtra' },

    // Junnar Taluka
    { taluka: 'Junnar', village_name: 'Junnar', district: 'Pune', state: 'Maharashtra' },
    { taluka: 'Junnar', village_name: 'Narayangaon', district: 'Pune', state: 'Maharashtra' },
    { taluka: 'Junnar', village_name: 'Manchar', district: 'Pune', state: 'Maharashtra' },
    { taluka: 'Junnar', village_name: 'Otur', district: 'Pune', state: 'Maharashtra' },

    // Ambegaon Taluka
    { taluka: 'Ambegaon', village_name: 'Ghodegaon', district: 'Pune', state: 'Maharashtra' },
    { taluka: 'Ambegaon', village_name: 'Manchar', district: 'Pune', state: 'Maharashtra' },
    { taluka: 'Ambegaon', village_name: 'Pimpri Sandas', district: 'Pune', state: 'Maharashtra' },

    // Khed Taluka
    { taluka: 'Khed', village_name: 'Rajgurunagar', district: 'Pune', state: 'Maharashtra' },
    { taluka: 'Khed', village_name: 'Chakan', district: 'Pune', state: 'Maharashtra' },
    { taluka: 'Khed', village_name: 'Alandi', district: 'Pune', state: 'Maharashtra' },

    // Solapur District (nearby)
    { taluka: 'Madha', village_name: 'Madha', district: 'Solapur', state: 'Maharashtra' },
    { taluka: 'Madha', village_name: 'Phaltan', district: 'Solapur', state: 'Maharashtra' },
    { taluka: 'Karmala', village_name: 'Karmala', district: 'Solapur', state: 'Maharashtra' },

    // Satara District (nearby)
    { taluka: 'Phaltan', village_name: 'Phaltan', district: 'Satara', state: 'Maharashtra' },
    { taluka: 'Phaltan', village_name: 'Lonand', district: 'Satara', state: 'Maharashtra' },
    { taluka: 'Man', village_name: 'Man', district: 'Satara', state: 'Maharashtra' },
  ]);
}