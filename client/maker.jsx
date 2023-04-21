const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

const handleTwiddle = (e) => {
    e.preventDefault();
    helper.hideError();

    const text = e.target.querySelector('#twiddleText').value;
    const image = e.target.querySelector('#twiddleImage').value;

    if (!text || !image) {
        helper.handleError('All fields are required!');
        return false;
    }

    helper.sendPost(e.target.action, {text, image}, loadTwiddlesFromServer);

    return false;
}

const TwiddleForm = (props) => {
    return (
        <form id="twiddleForm"
            onSubmit={handleTwiddle}
            name="twiddleForm"
            action="/maker"
            method="POST"
            className="twiddleForm"
        >
            <label htmlFor="text">Message Contents: </label>
            <input id="twiddleText" type="text" name="text" placeholder="Type your message here" />
            <label htmlFor="image">     Attach image?: </label>
            <input id="twiddleImage" type="number" min="0" name="image" />
            <input className="makeTwiddleSubmit" type="submit" value="Make Twiddle" />
        </form>
    );
}

const TwiddleList = (props) => {
    if (props.twiddles.length === 0) {
        return (
            <div className="twiddleList">
                <h3 className="emptyTwiddle">No Twiddles Yet!</h3>
            </div>
        );
    }

    const twiddleNodes = props.twiddles.map(twiddle => {
        return (
            <div key={twiddle._id} className="twiddle">
                <img src="/assets/img/twiddlerface.jpeg" alt="" className="twiddlerFace" />
                <h2 className="twiddleUsername"> Username {twiddle.username} </h2>
                <h3 className="twiddleText"> {twiddle.text} </h3>
                <h3 className="twiddleImage"> Image (placeholder): {twiddle.image} </h3>
            </div>
        );
    });

    return (
        <div className="twiddleList">
            {twiddleNodes}
        </div>
    )
}

const loadTwiddlesFromServer = async () => {
    const response = await fetch('/getTwiddles');
    const data = await response.json();
    ReactDOM.render(
        <TwiddleList twiddles={data.twiddles} />,
        document.getElementById('twiddles')
    );
}

const init = () => {
    ReactDOM.render(
        <TwiddleForm />,
        document.getElementById('makeTwiddle')
    );

    ReactDOM.render(
        <TwiddleList twiddles={[]} />,
        document.getElementById('twiddles')
    );

    loadTwiddlesFromServer();
}

window.onload = init;