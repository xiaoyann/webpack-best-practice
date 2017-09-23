import Hello from 'views/hello'

export default [
  {
    path: '/',
    redirect: '/hello'
  },
  {
    path: '/hello',
    component: Hello
  }
]
