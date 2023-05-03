const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

//////////// Twiddle Functions ////////////////
// Handle sending user-inputted Twiddle data to database
const handleTwiddle = (e) => {
    e.preventDefault();
    helper.hideError();

    const text = e.target.querySelector('#twiddleText').value;
    const image = e.target.querySelector('.twiddleImage').value;

    if (!text && !image) {
        helper.handleError('All fields are required!');
        return false;
    }

    helper.sendPost(e.target.action, { text, image }, loadTwiddlesFromServer);

    return false;
}

// Allow the user to upload Twiddles
const TwiddleForm = (props) => {
    return (
        <form id="twiddleForm"
            onSubmit={handleTwiddle}
            name="twiddleForm"
            action="/home"
            method="POST"
            className="twiddleForm"
        >
            <label htmlFor="text">Message Contents: </label>
            <input id="twiddleText" type="text" name="text" placeholder="Type your message here" />
            <br />
            <br />

            {/* Form for uploading images to display in the Twiddle (only if pro user)*/}
            <label htmlFor="uploadForm"> Attach image?: </label>
            <form
                id='uploadForm'
                name="uploadForm"
                class='twiddleImage'
                action='/upload'
                method='post'
                encType="multipart/form-data">
                <input id="browseButton" type="file" name="sampleFile" disabled />
                <input id="uploadButton" type='submit' value='Upload Image' disabled />
            </form>

            {/* Retrieve form for testing: */}
            {/* <form  
                id='retrieveForm' 
                action='/retrieve' 
                method='get'>
                <label for='fileName'>Retrieve File By ID: </label>
                <input name='_id' type='text' />
                <input type='submit' value='Retrieve!' />
            </form> */}

            <input className="makeTwiddleSubmit" type="submit" value="Make Twiddle" />
            <span class="proSpan">
                <label htmlFor="proCheckbox"> Enable image upload for pro users: </label>
                {/* Referenced for formatting/naming: */}
                {/* https://www.w3schools.com/tags/att_input_type_checkbox.asp */}
                <input id="proCheckbox" type="checkbox" name="proCheckbox" />
            </span>

        </form>
    );
}

// Format and display the list of Twiddles
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
                {/* <img className="twiddleImage" src="/retrieve?_id=1234" alt=""> {twiddle.imageID} </img> */}
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

// Retrieve Twiddles from the database
const loadTwiddlesFromServer = async () => {
    const response = await fetch('/getTwiddles');
    const data = await response.json();
    ReactDOM.render(
        // Display in reverse chronological order (newest first)
        <TwiddleList twiddles={(data.twiddles).reverse()} />,
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

// Toggle Pro Mode for the user, allowing image uploading
const togglePro = () => {
    const proEnabled = document.getElementById('proCheckbox').checked;
    const browseButton = document.getElementById('browseButton');
    const uploadButton = document.getElementById('uploadButton');

    if (proEnabled) {
        browseButton.disabled = false;
        uploadButton.disabled = false;
    } else {
        browseButton.disabled = true;
        uploadButton.disabled = true;
    }
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

    const uploadForm = document.getElementById('uploadForm');
    uploadForm.addEventListener('submit', uploadFile);

    const proButton = document.getElementById('proCheckbox');
    proButton.addEventListener('click', togglePro);

}

window.onload = init;