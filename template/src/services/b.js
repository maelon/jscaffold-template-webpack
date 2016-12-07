'use strict';

export default msg => {
    console.log('services/b say:', msg);
    return msg + msg;
};
