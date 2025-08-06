export interface Item {
  _id: string;
  title: string;
  category: { _id: string; label: string };
  status: string;
  requests: string[];
}

export interface Request {
  _id: string;
  itemID: { title: string };
  requesterID?: { name: string; email: string; location: string };
  ownerID?: { name: string; email: string; location: string };
  status: string;
  requestDate: string;
}

export interface Category {
  _id: string;
  label: string;
}

export interface Message {
  _id?: string;
  senderID: { _id: string; name?: string } | string;
  text: string;
  timestamp?: string;
}

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  location?: string;
}

export interface BrowseItem {
  _id: string;
  title: string;
  category: { _id: string; label: string };
  status: string;
  ownerID: { _id: string; name: string };
}
