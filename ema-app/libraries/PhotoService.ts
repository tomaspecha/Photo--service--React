const apibase = "https://ocl-jhub-tm352.open.ac.uk/user/559/proxy/3000/photo/";
// For local install use:
// const apibase = "http://192.168.194.1:3000/photo/";

export class Photo {
  user: string = "";
  id: string = "";
  votes: number = 0;
  location: string = "";
  uri: string = "";
  comments: string[] = [];

  constructor(user: string, id: string, location: string, uri: string, votes: number, comments: string[]) {
    console.log(`Creating new Photo: user=${user}, id=${id}, location=${location}, uri=${uri}, votes=${votes}, comments=${comments.length} comments`);
    this.user = user;
    this.id = id;
    this.location = location;
    this.uri = uri;
    this.comments = comments;
    this.votes = votes;
  }

  stringify(): string {
    return JSON.stringify(this);
  }
}

function checkResponse(response: any): any {
  if (response.status !== "success") {
    throw new Error(`Service error: ${response.message || "Unknown error"}`);
  }
  return response.data || response;
}

export async function getPhotos(userid: string): Promise<Photo[]> {
  const response = await fetch(`${apibase}?userid=${userid}`);
  const json = await response.json();
  const data = checkResponse(json);
  return data.map((item: any) => new Photo(item.user, item.id, item.location, item.uri, item.votes, item.comments));
}

export async function getPhoto(userid: string, id: string): Promise<Photo> {
  const response = await fetch(`${apibase}${id}`);
  const json = await response.json();
  const data = checkResponse(json);
  return new Photo(data.user, data.id, data.location, data.uri, data.votes, data.comments);
}

export async function addPhoto(userid: string, uri: string, location: string): Promise<any> {
  if (!uri.startsWith("data:image")) {
    throw new Error("Only base64 encoded images are supported");
  }
  const response = await fetch(apibase, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userid, uri, location }),
  });
  if (!response.ok) {
    throw new Error(`Error adding photo: ${response.status}`);
  }
  const json = await response.json();
  return checkResponse(json);
}

export async function registerUser(userid: string): Promise<any> {
  const response = await fetch(`${apibase}users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userid }),
  });
  if (!response.ok) {
    throw new Error(`Error registering user: ${response.status}`);
  }
  const json = await response.json();
  return checkResponse(json);
}

export async function addVote(userid: string, id: string): Promise<any> {
  const response = await fetch(`${apibase}vote/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userid }),
  });
  if (!response.ok) {
    throw new Error(`Error voting on photo: ${response.status}`);
  }
  const json = await response.json();
  return checkResponse(json);
}

export async function addComment(userid: string, id: string, comment: string): Promise<any> {
  const response = await fetch(`${apibase}comment/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userid, comment }),
  });
  if (!response.ok) {
    throw new Error(`Error adding comment: ${response.status}`);
  }
  const json = await response.json();
  return checkResponse(json);
}
