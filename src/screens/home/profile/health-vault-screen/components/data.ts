export const myDocuments = [
  {
    id: 1,
    fileName: 'Insurance-Statement-09.2022.pdf',
    tags: [1, 3],
    uploadedAt: '2014-08-12',
    deleted: false,
  },
  {
    id: 2,
    fileName: 'Seton_Medical_Bill_2019.pdf',
    tags: [2],
    uploadedAt: '2014-05-12',
    deleted: false,
  },
  {
    id: 3,
    fileName: 'Release-Authorization.pdf',
    tags: [4, 5],
    uploadedAt: '2014-02-12',
    deleted: false,
  },
  {
    id: 4,
    fileName: 'General_Consent.pdf',
    tags: [1, 4],
    uploadedAt: '2013-05-12',
    deleted: true,
  },
  {
    id: 5,
    fileName: 'Valerie-Insurance-ID.jpg',
    tags: [1, 2, 3],
    uploadedAt: '2011-08-12',
    deleted: true,
  },
  {
    id: 6,
    fileName: 'Extra document 1.pdf',
    tags: [2, 4],
    uploadedAt: '2011-08-12',
    deleted: false,
  },
  {
    id: 7,
    fileName: 'Extra image 1.jpg',
    tags: [1, 2],
    uploadedAt: '2011-08-12',
    deleted: false,
  },
];

export const tags = [
  { id: 1, name: 'Legal' },
  { id: 2, name: 'Financial' },
  { id: 3, name: 'Identification' },
  { id: 4, name: 'Medical' },
  { id: 5, name: 'Other' },
  { id: 6, name: 'Insurance' },
];

export const sharedDocuments = [
  {
    id: 1,
    document: 1,
    recipient: 'Susan Miller',
    createdAt: '2022-03-15',
    expirationDuration: 1,
  },
  {
    id: 6,
    document: 4,
    recipient: 'Bill Jackson',
    createdAt: '2023-03-01',
    expirationDuration: 7,
  },
  {
    id: 2,
    document: 1,
    recipient: 'Michael Kim',
    createdAt: '2021-06-05',
    expirationDuration: 30,
  },
  {
    id: 3,
    document: 3,
    recipient: 'Susan Miller',
    createdAt: '2018-09-19',
    expirationDuration: 180,
  },
  {
    id: 4,
    document: 2,
    recipient: 'Susan Miller',
    createdAt: '2023-01-11',
    expirationDuration: 365,
  },
  {
    id: 5,
    document: 5,
    recipient: 'Susan Miller',
    createdAt: '2022-11-25',
    expirationDuration: 30,
  },
];

export const users = [
  { id: 1, name: 'Jason Hayes', birthDate: '03/10/2022' },
  { id: 2, name: 'Michael Kim', birthDate: '03/10/2022' },
  { id: 3, name: 'Amit', birthDate: '03/10/2022' },
];

export const receivedDocuments = [
  {
    id: 1,
    document: 1,
    sender: 2,
    sharedAt: '2022-03-15',
    expirationDuration: 1,
  },
  {
    id: 6,
    document: 4,
    sender: 1,
    sharedAt: '2023-03-01',
    expirationDuration: 7,
  },
  {
    id: 2,
    document: 1,
    sender: 3,
    sharedAt: '2021-06-05',
    expirationDuration: 30,
  },
  {
    id: 3,
    document: 3,
    sender: 1,
    sharedAt: '2018-09-19',
    expirationDuration: 180,
  },
  {
    id: 4,
    document: 2,
    sender: 2,
    sharedAt: '2023-01-11',
    expirationDuration: 365,
  },
  {
    id: 5,
    document: 5,
    sender: 3,
    sharedAt: '2022-11-25',
    expirationDuration: 30,
  },
];
