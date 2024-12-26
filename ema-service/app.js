"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
/**
 * Class to represent a photo.
 */
class Photo {
    constructor(user, id, location, uri) {
        this.user = "";
        this.id = "";
        this.votes = 0;
        this.location = "";
        this.uri = "";
        this.comments = [];
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
    stringify() {
        return JSON.stringify(this);
    }
}
// Create the Express app
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ limit: '50mb' }));
const base = "/photo/";
const port = 3000;
// Start the server
app.listen(port, () => {
    console.log(`API server listening on port ${port}`);
});
// Data storage
let photos = [];
let photoIDCounter = 0;
let users = [];
/**
 * GET /photo - Returns all photos or an error if the user is not registered.
 */
app.get(base, (request, response) => {
    const userid = request.query.userid;
    if (!userid || !isUserRegistered(userid)) {
        response.status(400).send({ status: "error", message: "User not registered" });
    }
    else {
        response.send(getImp(""));
    }
});
/**
 * GET /photo/:id - Returns a specific photo or an error if the user is not registered.
 */
app.get(base + ":id", (request, response) => {
    const userid = request.query.userid;
    if (!userid || !isUserRegistered(userid)) {
        response.status(400).send({ status: "error", message: "User not registered" });
    }
    else {
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
    }
    else {
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
    }
    else {
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
    }
    else {
        response.send(postCommentImp(request.params.id, comment));
    }
});
// Helper functions
/**
 * Implementation of GET /photo. Returns all photos or a specific photo by ID.
 */
function getImp(id) {
    const result = photos.filter(photo => !id || photo.id === id);
    if (result.length > 0) {
        return JSON.stringify({ status: "success", data: result });
    }
    else {
        return JSON.stringify({ status: "error", message: "No matching records" });
    }
}
/**
 * Implementation of POST /photo. Adds a new photo to the database.
 */
function postImp(userid, location, uri) {
    const newPhoto = new Photo(userid, photoIDCounter.toString(), location, uri);
    photos.push(newPhoto);
    photoIDCounter++;
    return JSON.stringify({ status: "success", data: { id: newPhoto.id } });
}
/**
 * Implementation of POST /photo/comment/:id. Adds a comment to a photo.
 */
function postCommentImp(id, comment) {
    const photo = photos.find(photo => photo.id === id);
    if (photo) {
        photo.comments.push(comment);
        return JSON.stringify({ status: "success" });
    }
    else {
        return JSON.stringify({ status: "error", message: "No matching records" });
    }
}
/**
 * Implementation of POST /photo/vote/:id. Adds a vote to a photo.
 */
function postVoteImp(id) {
    const photo = photos.find(photo => photo.id === id);
    if (photo) {
        photo.votes++;
        return JSON.stringify({ status: "success" });
    }
    else {
        return JSON.stringify({ status: "error", message: "No matching records" });
    }
}
/**
 * Checks if a user is registered.
 */
function isUserRegistered(userid) {
    return users.includes(userid);
}
/**
 * Implementation of POST /photo/users. Registers a new user.
 */
function userImp(userid) {
    if (isUserRegistered(userid)) {
        return JSON.stringify({ status: "error", message: "User already registered" });
    }
    else {
        users.push(userid);
        return JSON.stringify({ status: "success" });
    }
}
