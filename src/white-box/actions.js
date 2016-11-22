const gets = value => ({value, action: 'next'});
const throws = value => ({value, action: 'throw'});

module.exports = {gets, throws};
