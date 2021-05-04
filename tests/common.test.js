import { TIME_FORMAT } from "../src/common/constants/time";
import { utc, compareDiffKeys } from "../src/common/utils";

const mockdateFormatByCountry = (type) => TIME_FORMAT[type] || TIME_FORMAT.EN;
const mockDate = "2020-09-11T07:19:07.336Z"; // Friday, September 11, 2020 2:19 PM
const dateFromPicker = "16-Sep-2020";

test("return format VN", () => {
  expect(mockdateFormatByCountry("VN", mockDate)).toBe(TIME_FORMAT.VN);
});

test("return format EN when param not valid", () => {
  expect(mockdateFormatByCountry("YY", mockDate)).toBe(TIME_FORMAT.EN);
});

// ----------------
test("return difference keys", () => {
  const model = { name: "Koo", birthday: "19/09/2010", email: "koo@email.com" };
  const dataObj = { name: "Test", dob: "19/09/2015" };
  expect(compareDiffKeys(model, dataObj)).toStrictEqual(["birthday", "email"]);
});

