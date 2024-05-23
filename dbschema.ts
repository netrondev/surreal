import { z } from "zod";
export const TBaccount = z.array(
  z.object({
    access_token: z.string(),
    expires_at: z.number(),
    id: z.object({ tb: z.string(), id: z.string() }),
    provider: z.string(),
    providerAccountId: z.string(),
    refresh_token: z.string(),
    scope: z.string(),
    token_type: z.string(),
    type: z.string(),
    userId: z.object({ tb: z.string(), id: z.string() }),
  })
);

export type TBaccount_type = z.infer<typeof TBaccount>[number];

export const TBapikey = z.array(
  z.object({
    created_at: z.object({}),
    id: z.object({ tb: z.string(), id: z.string() }),
    name: z.string(),
    secret: z.string(),
    user: z.object({ tb: z.string(), id: z.string() }),
  })
);

export type TBapikey_type = z.infer<typeof TBapikey>[number];

export const TBclients = z.array(
  z.object({
    client_address: z.string(),
    client_city: z.string(),
    client_company_cell: z.string(),
    client_company_name: z.string(),
    client_company_reg: z.string(),
    client_company_trading_name: z.string(),
    client_company_vat: z.string(),
    client_is_company: z.boolean(),
    client_postal_code: z.string(),
    contact_email: z.string(),
    contact_name: z.string(),
    contact_phone: z.string(),
    contact_surname: z.string(),
    created_by: z.string(),
    id: z.object({ tb: z.string(), id: z.string() }),
    team: z.string(),
  })
);

export type TBclients_type = z.infer<typeof TBclients>[number];

export const TBsellers = z.array(
  z.object({
    contact_email: z.string(),
    contact_name: z.string(),
    contact_phone: z.string(),
    contact_surname: z.string(),
    created_by: z.string(),
    id: z.object({ tb: z.string(), id: z.string() }),
    seller_address: z.string(),
    seller_city: z.string(),
    seller_company_cell: z.string(),
    seller_company_name: z.string(),
    seller_company_reg: z.string(),
    seller_company_trading_name: z.string(),
    seller_company_vat: z.string(),
    seller_id_no: z.string(),
    seller_is_company: z.boolean(),
    seller_postal_code: z.string(),
    team: z.object({ tb: z.string(), id: z.string() }),
  })
);

export type TBsellers_type = z.infer<typeof TBsellers>[number];

export const TBsession = z.array(
  z.object({
    expires: z.object({}),
    id: z.object({ tb: z.string(), id: z.string() }),
    sessionToken: z.object({
      bytes: z.object({
        0: z.number(),
        1: z.number(),
        2: z.number(),
        3: z.number(),
        4: z.number(),
        5: z.number(),
        6: z.number(),
        7: z.number(),
        8: z.number(),
        9: z.number(),
        10: z.number(),
        11: z.number(),
        12: z.number(),
        13: z.number(),
        14: z.number(),
        15: z.number(),
      }),
    }),
    userId: z.object({ tb: z.string(), id: z.string() }),
  })
);

export type TBsession_type = z.infer<typeof TBsession>[number];

export const TBteam = z.array(
  z.union([
    z.object({
      description: z.string(),
      id: z.object({ tb: z.string(), id: z.string() }),
      image: z.undefined(),
      name: z.string(),
      owner: z.object({ tb: z.string(), id: z.string() }),
      slug: z.string(),
    }),
    z.object({
      description: z.string(),
      id: z.object({ tb: z.string(), id: z.string() }),
      image: z.string(),
      name: z.string(),
      owner: z.object({ tb: z.string(), id: z.string() }),
      slug: z.string(),
    }),
  ])
);

export type TBteam_type = z.infer<typeof TBteam>[number];

export const TBteammember = z.array(
  z.union([
    z.object({
      id: z.object({ tb: z.string(), id: z.string() }),
      pending: z.boolean(),
      role: z.string(),
      team: z.object({ tb: z.string(), id: z.string() }),
      user: z.object({ tb: z.string(), id: z.string() }),
    }),
    z.object({
      created_at: z.object({}),
      email: z.string(),
      id: z.object({ tb: z.string(), id: z.string() }),
      invited_by: z.object({ tb: z.string(), id: z.string() }),
      pending: z.boolean(),
      role: z.string(),
      team: z.object({ tb: z.string(), id: z.string() }),
    }),
    z.object({
      created_at: z.object({}),
      email: z.string(),
      id: z.object({ tb: z.string(), id: z.string() }),
      invited_by: z.object({ tb: z.string(), id: z.string() }),
      pending: z.boolean(),
      role: z.string(),
      team: z.object({ tb: z.string(), id: z.string() }),
      user: z.object({ tb: z.string(), id: z.string() }),
    }),
  ])
);

export type TBteammember_type = z.infer<typeof TBteammember>[number];

export const TBuser = z.array(
  z.union([
    z.object({
      email: z.string(),
      emailVerified: z.null(),
      id: z.object({ tb: z.string(), id: z.string() }),
      image: z.string(),
      name: z.string(),
    }),
    z.object({
      email: z.string(),
      emailVerified: z.object({}),
      id: z.object({ tb: z.string(), id: z.string() }),
      name: z.string(),
    }),
    z.object({
      email: z.string(),
      emailVerified: z.object({}),
      id: z.object({ tb: z.string(), id: z.string() }),
      image: z.string(),
      name: z.string(),
    }),
  ])
);

export type TBuser_type = z.infer<typeof TBuser>[number];

export const TBvehicle = z.array(
  z.object({
    color: z.string(),
    created_by: z.string(),
    engineNumber: z.string(),
    id: z.object({ tb: z.string(), id: z.string() }),
    licNumber: z.string(),
    make: z.string(),
    mmCode: z.string(),
    model: z.string(),
    odoReading: z.number(),
    purchaseAmount: z.number(),
    purchaseDate: z.object({}),
    purchasedBy: z.string(),
    purchasedFrom: z.string(),
    sold: z.boolean(),
    team: z.object({ tb: z.string(), id: z.string() }),
    vinNumber: z.string(),
    year: z.number(),
  })
);

export type TBvehicle_type = z.infer<typeof TBvehicle>[number];

export const TBverificationToken = z.array(
  z.object({
    expires: z.object({}),
    id: z.object({ tb: z.string(), id: z.string() }),
    identifier: z.string(),
    token: z.string(),
  })
);

export type TBverificationToken_type = z.infer<typeof TBverificationToken>[number];

export type DB = {
  "account": TBaccount_type
  "apikey": TBapikey_type
  "clients": TBclients_type
  "sellers": TBsellers_type
  "session": TBsession_type
  "team": TBteam_type
  "teammember": TBteammember_type
  "user": TBuser_type
  "vehicle": TBvehicle_type
  "verificationToken": TBverificationToken_type
}
