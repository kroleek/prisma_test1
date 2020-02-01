import uuid from "uuid/v4";
import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

function getUniqueKey() {
  return +new Date();
}

async function createRecord(id: string): Promise<string> {
  const externalId = getUniqueKey();

  const result = await prismaClient.travelInsurance.create({
    select: { id: true },
    data: {
      id,
      externalId,
      persons: {
        create: [
          {
            name: "joe"
          }
        ]
      }
    }
  });

  return result.id;
}

async function getRecord(id: string) {
  const get = await prismaClient.travelInsurance.findOne({
    where: { id },
    select: {
      id: true,
      persons: {
        select: {
          id: true
        }
      }
    }
  });

  return get;
}

describe("should select related data", () => {
  it("when using UUID as id", async () => {
    const id = await createRecord(uuid());
    const result = await getRecord(id);

    expect(result?.persons).toHaveLength(1);
  });

  it("when using simple string as id", async () => {
    const id = await createRecord(String(getUniqueKey()));
    const result = await getRecord(id);

    expect(result?.persons).toHaveLength(1);
  });
});
