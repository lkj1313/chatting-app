import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: "chatting-app-33e4e",
      clientEmail:
        "firebase-adminsdk-57wa9@chatting-app-33e4e.iam.gserviceaccount.com",
      privateKey:
        "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDkRecQlCKrsvQf\n1J62uc5uc5sUCo0/HKiYoymUUICd823AJw30JvJeHr/oTHmXsFM4OXWmF2wkIZkO\n2iPiiuqzMnI5dPK94YOgV5PsezErEWNV07X4BkKCSnLrWzOvDYnQkBIBcgJ+kGgZ\nO5TusTb3KnLiYoOcPWzeioDRBNdPxo/nyvtPOTudVbjuxBrhPoRGURGpa4kvxxYb\nkoX1vc3Y9Dh9xztPKh/lWmEpdLk4t/qS/77poCKjL4M/8ITQDawPFDSXBzYqSKNo\npQTPtyY7z98mZsIHSyJXrBcdxhnwl2/84XrubpemvOqYQO4wR+uTV2/NmA8UBPTd\nA87A+Q01AgMBAAECggEAM7ZMOpq8YfYnzKAvlkhwZeAllPww9EerP+zSiglUobOY\nPMv8Ir/B7yV7JwZQE1d7+sQ1jTtIIcVEtbMgJv1+XrsCWlbOeMqCNYwxdASSZmXJ\ngZN06SuN3JM+BmhCRJlGC6vfkFlCDGbtVi4DtrEJuSNyJCvaEcZuh9mLhg5ZMnZk\n70yOHPZVxN/XDxND3ESWZPZ0yzG7g+S4hR9egWmdHrIzhI3/qHSj6cs4UQoN33s2\nonqw84dYVsUvskEjak15u03WlCaVqok5JywVp9X3E+XMQb0CjK15LUUJSPwFKOdy\nWKIw7y7CrqFy3qAzsoM3Y1Kl+kU5EjJEaKh6CAHIXwKBgQD14hKwgweJ5ndU0emb\nz0PIDEc0fCdnjki0JeEwPZsNA6YKauRkcBApaZGd0kPLZTlib3Sr+tZUl7ZAUbav\ncE9I+eyu1v2AdFehxKOc4DBqubvgrIe7CB2ucjQYOp+PrJtmT6seEEfspWYPkPIV\nDT2GaMPCDZwgY5JMPLA4iGAmywKBgQDtqlcTtJ+ogL2c8FofWC+KHgnMmE+cluBg\ndlh2Kn11y2BeJtypoowLqve9cpWErU7hbWpxSr2iLSPzoWbr3CwEqcEgTx5YJ/Rx\ncmSXZhIXxRHcosRswzA20SlJ2facQF7I6y75EReta9A0PAt7fFyI1UHdEQPDdBmJ\nKuCAwPEb/wKBgHyE6ZwULywp14LP7zMlqpjThvfQbBAoYS9CA6FvgWb80whxi4pF\nqhmeycyX4BdQAtiTww0ZMZOTZQt7lj2QbcZyMud0Htr/kCVvNMBMVJinyLqGBRK1\nkHp4gWNHxOh4rBYLAIhwDEyOknoNmFsK4n5/7asHQ2qvojYTgdaPUcozAoGAMVOj\nUwGwCWb+862m5s6Ev2PQoNgT3eoqk5q8bXoQI/yb+a6TKdoEuv82/+jiQ3E85+iv\nqOfcR+aaiZw8IkPGFwmsfaouIBna0Bjv68RRiQFr3aEip3gzb40lxqAoYPGzOnwl\neagkg+fWhKDZuT1sbzHjw6AeadiU3DU79z0UTb0CgYEArlsZRLeLaJ1yBpDn8YdX\nY7BGkPxqmb4hAYtn/ARGYcUCGh1fmdP9peqWhAbrMQG0+FJgSGQAmZR3B/6Co3Sg\n9K9kGU51tP70b9A7s67NYDFpDR0Z1vXshE+ACYoLBTUrXNdkaj1FPh90NdAdrotD\nImgG7f9+qrCnPzWqvJzTnjM=\n-----END PRIVATE KEY-----\n",
    }),
  });
}

const adminAuth = admin.auth();
export { adminAuth };
