interface Project {
  id: string;
  name: string;
  description: string;
  descriptionPortuguese: string;
  coverImage: string;
  members: Member['id'][];
}

const projectBoilerplate: Project = {
  id: '',
  name: '',
  description: '',
  descriptionPortuguese: '',
  coverImage: '',
  members: []
}

interface Member {
  id: string;
  verified: boolean;
  head: boolean;
  email: string,
  discord: string,
  registrationDate: string,

  name: string;
  pronouns: string;
  age: string;
  profilePicture: string;
  about: string;
  aboutTechnical: string;

  notes: string,

  roles: string[];
  primaryRole: string;
  links: string[];
  images: string[];
}

const memberBoilerplate: Member = {
  id: '',
  verified: false,
  head: false,
  email: '',
  discord: '',
  registrationDate: '',

  name: '',
  pronouns: '',
  age: '',
  profilePicture: '',
  about: '',
  aboutTechnical: '',

  notes: '',

  roles: [],
  primaryRole: '',
  links: [''],
  images: [''],
}

export {
  Project, projectBoilerplate,
  Member, memberBoilerplate
}