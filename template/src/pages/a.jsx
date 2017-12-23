import React from 'react';

import service from 'services/a';

class A extends React.Component {
    constructor() {
        super();
    }

    componentDidMount() {
        console.log('pagea');
        service('i am a!');
    }

    render() {
        return (
            <div>page-aa</div>
        );
    }
}

export default A;
