import React from 'react';

import serviceb from 'services/b';

class B extends React.Component {
    constructor() {
        super();
    }

    componentDidMount() {
        console.log('pageb');
        serviceb('i am b!');
    }

    render() {
        return (
            <div>page-b</div>
        );
    }
}

export default B;
