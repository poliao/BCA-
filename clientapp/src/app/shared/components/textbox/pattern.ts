export enum Pattern {
  UpperOnly = "^[^a-z]*$",
  Username = "^[A-Za-z0-9@_.-]+$",
  Phone = "[0-9-#,]*",
  Code = "^[A-Za-z0-9_-]+$",
  Number = "[0-9]*",
  NumberNotZeroFirst = "^[1-9][0-9]*$",
}
