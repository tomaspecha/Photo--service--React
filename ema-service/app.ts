import express from 'express';
import cors from 'cors';

/**
 * Class to represent a photo.
 */
class Photo {
    user: string = "";
    id: string = "";
    votes: number = 0;
    location: string = "";
    uri: string = "";
    comments: string[] = [];

    constructor(user: string, id: string, location: string, uri: string) {
        this.user = user;
        this.id = id;
        this.location = location;
        this.uri = uri;
    }

    /**
     * Converts this photo to a JSON string.
     *
     * @returns JSON string representing this photo.
     */
    stringify(): string {
        return JSON.stringify(this);
    }
}

// Create the Express app
const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

const base = "/photo/";
const port = 3000;

// Start the server
app.listen(port, () => {
    console.log(`API server listening on port ${port}`);
});

// Data storage
let photos: Photo[] = [];
let photoIDCounter = 0;
let users: string[] = [];

/**
 * GET /photo - Returns all photos or an error if the user is not registered.
 */
app.get(base, (request, response) => {
    const userid = request.query.userid as string;
    if (!userid || !isUserRegistered(userid)) {
        response.status(400).send({ status: "error", message: "User not registered" });
    } else {
        response.send(getImp(""));
    }
});

/**
 * GET /photo/:id - Returns a specific photo or an error if the user is not registered.
 */
app.get(base + ":id", (request, response) => {
    const userid = request.query.userid as string;
    if (!userid || !isUserRegistered(userid)) {
        response.status(400).send({ status: "error", message: "User not registered" });
    } else {
        response.send(getImp(request.params.id));
    }
});

/**
 * POST /photo - Adds a new photo or returns an error if the user is not registered.
 */
app.post(base, (request, response) => {
    const { userid, location, uri } = request.body;
    if (!userid || !isUserRegistered(userid)) {
        response.status(400).send({ status: "error", message: "User not registered" });
    } else {
        response.send(postImp(userid, location, uri));
    }
});

/**
 * POST /photo/vote/:id - Adds a vote to a photo or returns an error if the user is not registered.
 */
app.post(base + "vote/:id", (request, response) => {
    const userid = request.body.userid;
    if (!userid || !isUserRegistered(userid)) {
        response.status(400).send({ status: "error", message: "User not registered" });
    } else {
        response.send(postVoteImp(request.params.id));
    }
});

/**
 * POST /photo/users - Registers a new user or returns an error if the user already exists.
 */
app.post(base + "users", (request, response) => {
    response.send(userImp(request.body.userid));
});

/**
 * POST /photo/comment/:id - Adds a comment to a photo.
 */
app.post(base + "comment/:id", (request, response) => {
    const { userid, comment } = request.body;
    if (!userid || !isUserRegistered(userid)) {
        response.status(400).send({ status: "error", message: "User not registered" });
    } else {
        response.send(postCommentImp(request.params.id, comment));
    }
});

// Helper functions

/**
 * Implementation of GET /photo. Returns all photos or a specific photo by ID.
 */
function getImp(id: string): string {
    const result = photos.filter(photo => !id || photo.id === id);
    if (result.length > 0) {
        return JSON.stringify({ status: "success", data: result });
    } else {
        return JSON.stringify({ status: "error", message: "No matching records" });
    }
}

/**
 * Implementation of POST /photo. Adds a new photo to the database.
 */
function postImp(userid: string, location: string, uri: string): string {
    const newPhoto = new Photo(userid, photoIDCounter.toString(), location, uri);
    photos.push(newPhoto);
    photoIDCounter++;
    return JSON.stringify({ status: "success", data: { id: newPhoto.id } });
}

/**
 * Implementation of POST /photo/comment/:id. Adds a comment to a photo.
 */
function postCommentImp(id: string, comment: string): string {
    const photo = photos.find(photo => photo.id === id);
    if (photo) {
        photo.comments.push(comment);
        return JSON.stringify({ status: "success" });
    } else {
        return JSON.stringify({ status: "error", message: "No matching records" });
    }
}

/**
 * Implementation of POST /photo/vote/:id. Adds a vote to a photo.
 */
function postVoteImp(id: string): string {
    const photo = photos.find(photo => photo.id === id);
    if (photo) {
        photo.votes++;
        return JSON.stringify({ status: "success" });
    } else {
        return JSON.stringify({ status: "error", message: "No matching records" });
    }
}

/**
 * Checks if a user is registered.
 */
function isUserRegistered(userid: string): boolean {
    return users.includes(userid);
}

/**
 * Implementation of POST /photo/users. Registers a new user.
 */
function userImp(userid: string): string {
    if (isUserRegistered(userid)) {
        return JSON.stringify({ status: "error", message: "User already registered" });
    } else {
        users.push(userid);
        return JSON.stringify({ status: "success" });
    }
}
