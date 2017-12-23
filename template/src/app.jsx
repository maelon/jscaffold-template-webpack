import React from 'react';
import ReactDOM from 'react-dom';

import Thumb from 'components/thumb';

class App extends React.Component {
    constructor() {
        super();

        this.state = {
            'pageName': '',
            'page': null
        };
        this._handleHash = this._handleHash.bind(this);
    }

    componentDidMount() {
        window.addEventListener('hashchange', this._handleHash);
        this._handleHash();
    }

    showA() {
        window.location.hash = 'a';
    }

    showB() {
        window.location.hash = 'b';
    }

    render() {
        return (
            <div>
                <div>哈哈哈</div>
                <div id="page">{this._renderPage()}</div>
                <button onClick={this.showA}>showA</button>
                <button onClick={this.showB}>showB</button>
                <Thumb/>
            </div>
        );
    }

    _renderPage() {
        if(this.state.pageName === 'a') {
            return React.createElement(this.state.page.default);
        } else if(this.state.pageName === 'b') {
            return React.createElement(this.state.page.default);
        }
        return null;
    }

    async _handleHash(hash) {
        const that = this;
        if(window.location.hash === '#a') {
            const module = await import(/* webpackChunkName: "pagea" */ 'pages/a');
            this.setState({ 
                pageName: 'a',
                page: module
            });
        } else if(window.location.hash === '#b') {
            const module = await import(/* webpackChunkName: "pageb" */ 'pages/b');
            this.setState({ 
                pageName: 'b',
                page: module
            });
        }
    }
}

ReactDOM.render(
    <App/>,
    document.getElementById('app')
);
