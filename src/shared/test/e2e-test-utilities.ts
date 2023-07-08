export function expectEndpointCalledSuccessfully(result, statusCode = 200) {
  expect(result.statusCode).toEqual(statusCode);
  expect(result.json()).toHaveProperty('data');
}

export function expectEndpointCalledNotFound(result, errorMessage: string) {
  expect(result.statusCode).toEqual(404);
  expect(result.json()).toHaveProperty('message');
  expect(result.json()).toEqual({
    statusCode: 404,
    message: errorMessage,
    error: 'Not Found',
  });
}
