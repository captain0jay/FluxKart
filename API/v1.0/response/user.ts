type ContactResponseInput = {
  primaryContactId: number;
  emails: (string | undefined)[];
  phoneNumbers: (string | undefined)[];
  secondaryContactIds: (number | undefined)[];
};

type FormattedContactResponse = {
  contact: {
    primaryContatctId: number;
    emails: string[];
    phoneNumbers: string[];
    secondaryContactIds: number[];
  };
};

function identifyUserResponse(response: ContactResponseInput): FormattedContactResponse {
  const unique = <T>(arr: (T | undefined)[]): T[] => {
    return Array.from(new Set(arr?.filter((item): item is T => item !== undefined)));
  };

  return {
    contact: {
      primaryContatctId: response?.primaryContactId,
      emails: unique(response?.emails),
      phoneNumbers: unique(response?.phoneNumbers),
      secondaryContactIds: unique(response?.secondaryContactIds),
    }
  };
}

export { identifyUserResponse };
