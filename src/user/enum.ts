import { enumType } from "nexus";
import * as Prisma from "nexus-prisma";

export const UserType = enumType(Prisma.UserType);

export const UserStatus = enumType(Prisma.UserStatus);
