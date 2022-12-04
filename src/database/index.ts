import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, setDoc, DocumentData } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDOq0Rpfe1ro7X5Eixfpxq4zUQV-YKKX80",
  authDomain: "wonder-acid.firebaseapp.com",
  projectId: "wonder-acid",
  storageBucket: "wonder-acid.appspot.com",
  messagingSenderId: "863989077253",
  appId: "1:863989077253:web:d846b4b3108b199338d36c",
  measurementId: "G-17D711GFQM"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// data structure
// member -> name, role, profileImage
// head -> head -> members -> [member]
// teams -> toTheMoon -> name, description, coverImage, members -> [member]


interface Member {
  name: string;
  role: string;
  profilePicture: string;
}

interface HeadMember {
  name: string;
  role: string;
  profilePicture: string;
  id: string
}

interface Project {
  name: string;
  description: string;
  coverImage: string;
  members: Member[];
}

interface NewProject {
  name: string;
  description: string;
  coverImage: string;
  members: Member[];
  id: string
}


// head members operations
async function addMember(member: Member): Promise<string> {
  const docRef = await addDoc(collection(db, "head"), member);
  return docRef.id;
}

async function saveMember(member: HeadMember) {
  // remove old member;
  await deleteMember(member.id);
  const docRef = await setDoc(doc(db, 'head', member.id), {
    name: member.name,
    role: member.role,
    profilePicture: member.profilePicture
  });
  return docRef;
}

async function deleteMember(id: string) {
  await deleteDoc(doc(db, 'head', id));
  return id;
}

async function getMemberId(name: string): Promise<string> {
  const querySnapshot = await getDocs(collection(db, 'head'));
  let id = '';
  querySnapshot.forEach((doc) => {
    if (doc.data().name === name) {
      id = doc.id;
    }
  });
  return id;
}


// projects operations
async function addProject(project: Project): Promise<string> {
  const docRef = await addDoc(collection(db, 'teams'), {
    name: project.name,
    description: project.description,
    coverImage: project.coverImage,
    members: project.members
  });
  return docRef.id;
}

async function deleteProject(id: string): Promise<string> {
  await deleteDoc(doc(db, 'teams', id));
  return id;
}

async function getProjectId(name: string): Promise<string> {
  const querySnapshot = await getDocs(collection(db, 'teams'));
  let id = '';
  querySnapshot.forEach((doc) => {
    if (doc.data().name === name) {
      id = doc.id;
    }
  });
  return id;
}

async function editProject(project: NewProject) {
  const docRef = doc(db, 'teams', project.id);
  await deleteDoc(docRef);
  const addedDoc = await setDoc(doc(db, 'teams', project.id), {
    name: project.name,
    description: project.description,
    coverImage: project.coverImage,
    members: project.members
  });
  return addedDoc;
}

const getHead = async () => {
  const querySnapshot = await getDocs(collection(db, "head"));
  var head: DocumentData[] = [];
  querySnapshot.forEach((doc) => {
    head.push(doc.data());
  });
  return head;
}

const getProjects = async () => {
  const querySnapshot = await getDocs(collection(db, 'teams'));
  let lead: DocumentData[] = [];
  querySnapshot.forEach((doc) => {
    lead.push(doc.data());
  });
  return lead;
}

export {
  app,
  addMember, deleteMember, saveMember, getMemberId,
  addProject, editProject, deleteProject, getProjectId,
  getHead, getProjects,
  NewProject, Project, Member, HeadMember
};