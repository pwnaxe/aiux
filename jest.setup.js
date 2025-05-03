// Mock the navigator.textClassifier API
global.navigator.textClassifier = {
  classify: jest.fn().mockImplementation((text, options) => {
    return Promise.resolve({
      categories: [
        { name: "frustrated", score: 0.8 },
        { name: "satisfied", score: 0.1 },
        { name: "confused", score: 0.05 },
        { name: "engaged", score: 0.03 },
        { name: "disinterested", score: 0.02 },
      ],
    })
  }),
}
