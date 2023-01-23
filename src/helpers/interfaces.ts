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

  name: string;
  pronouns: string;
  age: string;
  profilePicture: string;
  about: string;
  aboutPortuguese: string;

  notes: string,

  roles: string[];
  links: string[];
  images: string[];
}

const memberBoilerplate: Member = {
  id: '',
  verified: false,
  head: false,
  email: '',

  name: '',
  pronouns: '',
  age: '',
  profilePicture: '',
  about: '',
  aboutPortuguese: '',

  roles: [],
  links: [''],
  images: [''],
}

export {
  Project, projectBoilerplate,
  Member, memberBoilerplate
}