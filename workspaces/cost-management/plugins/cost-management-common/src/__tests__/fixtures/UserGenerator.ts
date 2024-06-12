export const generateUser = (userId: number) => {
  return {
    id: userId,
    name: `User${userId}`,
    email: `user${userId}@example.com`,
    profile: {
      age: 20 + (userId % 30),
      gender: userId % 2 === 0 ? 'male' : 'female',
      address: {
        street_name: `${userId} Sample Street`,
        city: 'SampleCity',
        zip_code: `${10000 + userId}`
      },
      preferences: {
        newsletter: userId % 2 === 0,
        notifications: {
          email: userId % 3 === 0,
          sms: userId % 5 === 0
        }
      }
    },
    posts: Array.from({ length: 5 }, (_p1, postIndex) => ({
      id: userId * 10 + postIndex + 1,
      title: `Post Title ${userId * 10 + postIndex + 1}`,
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(20),
      tags: ["tag1", "tag2"],
      comments: Array.from({ length: 3 }, (_p2, commentIndex) => ({
        id: userId * 100 + commentIndex + 1,
        user: `User${(userId % 10) + 1}`,
        comment: 'This is a comment.',
        likes: userId % 5
      }))
    }))
  };
};
