import Head from 'next/head'
import Header from './Header'
import Footer from './Footer'
import 'antd/dist/antd.css';

const Layout = (props) => {
  const style = {
    minHeight: "800px"
  }

  return (
    <>
      <Head>
        <title>Ivizz</title>
        <link rel="icon" href="/images/ivizz/favicon.ico" />
        <script src="https://unpkg.com/@material-ui/core@4.11.0/umd/material-ui.production.min.js"></script>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
      </Head>
      <Header logoUrl={"/images/gems/logo.png"} />
      <main style={style}>
        {props.children}
      </main>
      <Footer />
    </>
  )
}

export default Layout