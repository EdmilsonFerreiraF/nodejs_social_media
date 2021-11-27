const bcrypt = require('bcryptjs')

class HashGenerator {
   hash = async (s)=> {
      const rounds = Number(process.env.BCRYPT_COST);
      const salt = await bcrypt.genSalt(rounds);
      const result = await bcrypt.hash(s, salt);

      return result;
   };

   compareHash = async (s, hash) => {
      return bcrypt.compare(s, hash);
   };
};

module.exports = HashGenerator