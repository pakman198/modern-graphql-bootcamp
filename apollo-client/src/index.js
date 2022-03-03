import ApolloClient, { gql } from 'apollo-boost';

const client = new ApolloClient({
  uri: "http://localhost:4000/gql"
})

const getUsers = gql`
  query {
    users {
      name
    }
  }
`;

client.query({
  query: getUsers
}).then(response => {
  console.log({ response })
  let html = '';

  response.data.users.forEach(user => {
    html += `
      <div>
        <h3>${user.name}</h3>
      </div>
    ` 
  });

  document.getElementById('users').innerHTML = html;
});

const getPosts = gql`
  query {
    allPosts {
      title
      author {
        name
      }
    }
  }
`;

client.query({
  query: getPosts
}).then(response => {
  console.log({ response })
  let html = '';

  response.data.allPosts.forEach(post => {
    html += `
      <div>
        <h3>${post.title}</h3>
        <h4>${post.author.name}</h4>
      </div>
    ` 
  });

  document.getElementById('posts').innerHTML = html;
});