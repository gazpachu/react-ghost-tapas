[![CircleCI](https://img.shields.io/circleci/project/vodafone/react-ghost-tapas/master.svg)]()

# What is Tapas?

Do you want to use the Ghost blogging platform in the back-end with React in the front-end? Then you are in the right place.

Tapas is a React.js based interface (website & admin panel) for the Ghost blogging platform API.

## Features

- ES6 and Babel integration
- Free of jQuery and Bootstrap
- Basic normalize CSS reset
- Custom CSS3 animation implementation
- Webpack development and production environment configuration
- Webpack Dev Server with Hot loader
- Webpack SCSS, SVG and IMG support
- Autoprefixer for all CSS rules
- ESLint with AirBnb rules
- React Router configuration with browser history and base path
- React Helmet for page titles and SEO
- React GA for Google Analytics integration
- Fastclick lib for quick touch events
- Redux implemtantion
- CircleCI and Heroku implementation
- PWA Offline caching, manifest and icons
- Optimised with Google's Lighthouse audit tool
- Includes common components for icons, loaders and notifications
- Froala text editor with plugins
- Reading progress scrollbar
- Datepicker integration
- Pagination for posts
- CRUD for Ghost posts with public and private API integration

## Getting Started

Install the dependencies using Yarn

````
yarn
````

If you need to install Ghost locally, you can follow [this article](https://docs.ghost.org/v1/docs/install-local). If on the other hand, you want to self-host Ghost on a server, you can follow [this other article](https://docs.ghost.org/v1/docs/hosting).

The easiest way is to install the Ghost CLI using `sudo npm i -g ghost-cli@latest`. Then install Ghost locally by running `ghost install local` inside a `ghost` folder within the `react-ghost` folder. Bear in mind that Ghost needs Node v8.9 and this project needs node v.7.4. You can use `nvm` to handle these two different node versions.

If everything goes well, you should see Ghost running on http://localhost:2368/. You can visit the admin panel at http://localhost:2368/ghost where you can create a user account for the blog owner. You can skip inviting other users at this point if you like.

Now you need to get client-secret by inspecting the `authentication/token` request in the original Ghost admin panel (http://localhost:2368/ghost) when you sign in. [More info](https://api.ghost.org/docs/user-authentication#retrieve-a-bearer-token-via-curl)

Add the path the Ghost instance, the client ID and the secret in /src/app/constants/constants.jsx

If the Ghost instance and the react-ghost app are running in different hosts, you will have to follow [this tutorial](https://api.ghost.org/docs/ajax-calls-from-an-external-website#1-granting-access-to-your-domain) to white-list the react-ghost host. Remember that if you are using a local DB, you have to edit `ghost-local.db`.

The SQL queries would look similar to this:

```
insert into client_trusted_domains (id, client_id, trusted_domain) values ('5a2a54900000000000000000', '5a3ba5aeba4eb8337739e311', 'http://localhost:8080');
insert into client_trusted_domains (id, client_id, trusted_domain) values ('5a2a54900000000000000001', '5a3ba5afba4eb8337739e312', 'http://localhost:8080');
```

### Start development server with hot reloading

````
yarn run dev
````

The website will be available at [localhost:8080](http://localhost:8080)

* If there is another app running on that port, it will use 8081

### Build for production

It will bundle all the files in the /dist folder

````
yarn run build
````

### Deploy to Heroku

It will deploy the app to your Heroku account

````
heroku deploy
````

### Credits

- Text Editor: [Froala](https://www.froala.com/)
- Homepage particles animation: [Vicent Garreau](http://vincentgarreau.com/particles.js/)
- Some icons by [Flaticon](http://flaticon.com/)
