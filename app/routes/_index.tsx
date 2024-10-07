export default function Contact() {
  return (
    <>
      <p id="index-page">
        This is a demo for Remix.
        <br />
        Check out <a href="https://remix.run">the docs at remix.run</a>.
      </p>

      <div>
        <b>Path Less Route</b>
        <p>when no child selected the _index route will be here;</p>
        <pre>_index.tsx</pre> leading underscore share layout for a group of
        routes without adding any path segment to the url
      </div>
    </>
  );
}
