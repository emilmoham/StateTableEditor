const Section = require('../Section');

test('parse description line single word', () => {
  const input = '*  stuff';
  const output = 'stuff';
  const section = new Section();
  section.parseDescriptionLine(input);
  expect(section.descriptionLines.length).toBe(1);
  expect(section.descriptionLines[0]).toBe(output);
});

test('parse description line multiple words', () => {
  const input = '*  lots of stuff';
  const output = 'lots of stuff';
  const section = new Section();
  section.parseDescriptionLine(input);
  expect(section.descriptionLines.length).toBe(1);
  expect(section.descriptionLines[0]).toBe(output);
});

test('parse description line words, numbers, and symbols', () => {
  const input = '*  do 3 (three) things';
  const output = 'do 3 (three) things';
  const section = new Section();
  section.parseDescriptionLine(input);
  expect(section.descriptionLines.length).toBe(1);
  expect(section.descriptionLines[0]).toBe(output);
});

test('parse description line multiple', () => {
  const input0 = '*  this is line number 1';
  const input1 = '*  this is line number 2';
  const output = ['this is line number 1', 'this is line number 2'];
  const section = new Section();
  section.parseDescriptionLine(input0);
  section.parseDescriptionLine(input1);
  expect(section.descriptionLines.length).toBe(2);
  expect(section.descriptionLines).toStrictEqual(output);
});

test('format single line description', () => {
  const input = 'this is line number 1';
  const output = `****************************************\n*  ${input}\n\n****************************************`;
  const section = new Section();
  section.descriptionLines = [input];
  expect(section.format()).toBe(output);
});

test('format multiple line description', () => {
  const input0 = 'this is line number 1';
  const input1 = 'this is line number 2';
  const output = `****************************************\n*  ${input0}\n*  ${input1}\n\n****************************************`;
  const section = new Section();
  section.descriptionLines = [input0, input1];
  expect(section.format()).toBe(output);
});
