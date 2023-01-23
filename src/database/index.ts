import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, query, where,
  getDoc, getDocs, addDoc, deleteDoc, doc, setDoc, DocumentData 
} from 'firebase/firestore';

import { Project, Member, projectBoilerplate, memberBoilerplate } from '../helpers/interfaces';

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


// members operations
async function addMember(): Promise<string> {
  const docRef = await addDoc(collection(db, "members"), memberBoilerplate);
  return docRef.id;
}

async function saveMember(member: Member) {
  console.log(member);

  await deleteMember(member.id);
  const docRef = await setDoc(doc(db, 'members', member.id), {
    id: member.id,
    verified: member.verified,
    head: member.head,
    email: member.email,
    name: member.name,
    age: member.age,
    profilePicture: member.profilePicture,
    pronouns: member.pronouns,
    about: member.about,
    aboutPortuguese: member.aboutPortuguese,
    notes: member.notes,
    roles: member.roles,
    links: member.links,
    images: member.images
  });
  return docRef;
}

async function deleteMember(id: string) {
  await deleteDoc(doc(db, 'members', id));
  return id;
}

async function getMemberId(name: string): Promise<string> {
  const querySnapshot = await getDocs(collection(db, 'members'));
  let id = '';
  querySnapshot.forEach((doc) => {
    if (doc.data().name === name) {
      id = doc.id;
    }
  });
  return id;
}

async function getMember(id: string): Promise<Member> {
  const docRef = doc(db, 'members', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as Member;
  } else {
    return {} as Member;
  }
}


// projects operations
async function addProject(): Promise<string> {
  const docRef = await addDoc(collection(db, 'teams'), projectBoilerplate);
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

async function editProject(project: Project) {
  const docRef = doc(db, 'teams', project.id);
  await deleteDoc(docRef);
  const addedDoc = await setDoc(doc(db, 'teams', project.id), {
    name: project.name,
    description: project.description,
    descriptionPortuguese: project.descriptionPortuguese,
    coverImage: project.coverImage,
    members: project.members
  });
  return addedDoc;
}

const getMembers = async () => {
  const querySnapshot = await getDocs(collection(db, "members"));
  var members: DocumentData[] = [];
  querySnapshot.forEach((doc) => {
    members.push(doc.data());
  });
  return members;
}

const getProjects = async () => {
  const querySnapshot = await getDocs(collection(db, 'teams'));
  let project: DocumentData[] = [];
  querySnapshot.forEach((doc) => {
    project.push(doc.data());
  });
  return project;
}

const checkIfVerified = async (id: string) => {
  const querySnapshot = await getDocs(collection(db, 'members'));
  let verified;
  querySnapshot.forEach((doc) => {
    verified = doc.data().verified;
  });
  return verified;
}

const checkIfHead = async (id: string) => {
  const querySnapshot = await getDocs(collection(db, 'members'));
  let head;
  querySnapshot.forEach((doc) => {
    head = doc.data().head;
  });
  return head;
}

// helpers operations
async function getAllRoles() {
  const querySnapshot = await getDocs(collection(db, 'helpers'));
  let roles: DocumentData[] = [];
  querySnapshot.forEach((doc) => {
    roles.push(doc.data());
  });
  return roles;
}

async function editRoles(id: string, roles: string[]) {
  const docRef = doc(db, 'helpers', id);
  await deleteDoc(docRef);
  const addedDoc = await setDoc(doc(db, 'helpers', id), {
    roles: roles
  });
  return addedDoc;
}

async function getAllTexts() {
  const querySnapshot = await getDocs(collection(db, 'texts'));
  let texts: DocumentData[] = [];
  querySnapshot.forEach((doc) => {
    texts.push(doc.data());
  });
  return texts;
}

async function getContactText() {
  const querySnapshot = await getDocs(query(collection(db, 'texts'), where('id', '==', 'contactUsView')));
  let texts: DocumentData[] = [];
  querySnapshot.forEach((doc) => {
    texts.push(doc.data());
  });
  return texts;
}

async function getJoinText() {
  const querySnapshot = await getDocs(query(collection(db, 'texts'), where('id', '==', 'joinUsView')));
  let texts: DocumentData[] = [];
  querySnapshot.forEach((doc) => {
    texts.push(doc.data());
  });
  return texts;
}

async function getTeamText() {
  const querySnapshot = await getDocs(query(collection(db, 'texts'), where('id', '==', 'teamView')));
  let texts: DocumentData[] = [];
  querySnapshot.forEach((doc) => {
    texts.push(doc.data());
  });
  return texts;
}



async function editText(id: string, text: { [key: string]: string; }) {
  const docRef = doc(db, 'texts', id);
  await deleteDoc(docRef);
  const addedDoc = await setDoc(doc(db, 'texts', id), text);
  return addedDoc;
}


export {
  app,
  getMember, getMembers, addMember, deleteMember, saveMember, getMemberId,
  getProjects, addProject, editProject, deleteProject, getProjectId,
  checkIfVerified, checkIfHead,
  getAllRoles, getAllTexts, editRoles, editText,
  getContactText, getJoinText, getTeamText
};