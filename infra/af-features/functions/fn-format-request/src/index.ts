const COMPANY_EDIT_SUBPATHS = [
  'details',
  'beneficial-owners',
  'signatory-rights',
];

function handler(
  event: AWSCloudFrontFunction.Event
): AWSCloudFrontFunction.Request {
  const request = event.request;
  const uri = request.uri;

  if (
    uri.includes('/company/edit/') &&
    !uri.includes('/_next/static/chunks/')
  ) {
    const subPath = uri.split('/').pop();

    if (subPath && COMPANY_EDIT_SUBPATHS.includes(subPath)) {
      request.uri = `/company/edit/[nationalIdentifier]/${subPath}.html`;
    } else {
      request.uri = '/company/edit/[nationalIdentifier].html';
    }
    return request;
  }

  if (uri === '/') {
    // turns "/" to "/index.html"
    request.uri += 'index.html';
  } else if (uri.endsWith('/')) {
    // turns "/foo/" to "/foo.html"
    request.uri = uri.slice(0, -1) + '.html';
  } else if (!uri.includes('.')) {
    // turns "/foo" to "/foo.html"
    request.uri += '.html';
  }

  return request;
}
