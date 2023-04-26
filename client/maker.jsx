const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

//////////// Twiddle Functions ////////////////
const handleTwiddle = (e) => {
    e.preventDefault();
    helper.hideError();

    const text = e.target.querySelector('#twiddleText').value;
    const image = e.target.querySelector('#twiddleImage').value;

    if (!text || !image) {
        helper.handleError('All fields are required!');
        return false;
    }

    helper.sendPost(e.target.action, { text, image }, loadTwiddlesFromServer);

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
            {/* <input id="twiddleImage" type="number" min="0" name="image" /> */}
            {/* Form for uploading images to display in the Twiddle (only if pro)*/}
            <form ref='uploadForm'
                id='uploadForm'
                action='/upload'
                method='post'
                encType="multipart/form-data">
                <input type="file" name="sampleFile" />
                <input type='submit' value='Upload!' />
            </form>
            {/* 
            Retrieve form ONLY IF NECESSARY:
            <form ref='retrieveForm' 
                id='retrieveForm' 
                action='/retrieve' 
                method='get'>
                <label for='fileName'>Retrieve File By ID: </label>
                <input name='_id' type='text' />
                <input type='submit' value='Retrieve!' />
            </form>

            For when I get image display/getting working"
            <img src="/retrieve?_id=1234" style="max-width: 1000px" />
            */}
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
                <h2 className="twiddleUsername"> &#64;{twiddle.username} </h2>
                <h3 className="twiddleText"> {twiddle.text} </h3>
                <h3 className="twiddleImage"> Image (placeholder): {twiddle.image} </h3>
                <h4 className="twiddleDate"> Sent {twiddle.createdDate}</h4>
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

////////////// File Upload /////////////
const uploadFile = async (e) => {
    e.preventDefault();

    const response = await fetch('/upload', {
        method: 'POST',
        body: new FormData(e.target),
    });

    const text = await response.text();
    document.getElementById('messages').innerText = text;

    return false;
};

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

    const uploadForm = document.getElementById('uploadForm');
    uploadForm.addEventListener('submit', uploadFile);
}

window.onload = init;