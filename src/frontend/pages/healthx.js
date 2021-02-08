// health check URL
function healthx() {
}

// This gets called on every request
export async function getServerSideProps(context) {
    context.res.end('OK');
    return { props: {} }
}

export default healthx;