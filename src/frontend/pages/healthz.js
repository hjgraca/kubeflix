// health check URL
function healthz() {
}

// This gets called on every request
export async function getServerSideProps(context) {
    context.res.end('OK');
    return { props: {} }
}

export default healthz;