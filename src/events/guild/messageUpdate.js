const constants = require('../../constants');

module.exports = async (oldMessage, newMessage) => {
  // MÅNSSON CHECKS
  if (newMessage.author.id === '136919142174294016') {
    console.log(
      'MÅNSSON EDITED: ',
      oldMessage.content,
      'to',
      newMessage.content
    );
    if (
      constants.MANSSON_BANNED_SEQUENCES.find((seq) =>
        newMessage.content.includes(seq)
      )
    ) {
      await newMessage.delete();
      return newMessage.reply(
        'Njaaa månsson, dedär vet jag inte om jag riktigt går med på :))'
      );
    }
  }
};
