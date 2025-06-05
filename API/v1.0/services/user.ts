import Constants from "../../../Constants/index.ts";
import Repo from "../../../Repo/index.ts";
import { asyncTryCatchHandler } from "../../../utils/tryCatch.ts";

async function identifyUserService(userData: any): Promise<any> {
    let userContacts : any[] = [];
    let response : any = {};

    await asyncTryCatchHandler(async () => {
          userContacts = await Repo.Contact.getContactByEmailOrPhoneNumber(userData?.email, userData?.phoneNumber || 0)
    }, { resourceType: 'USER', log: 'CONTACT', message: 'Error creating user contact', meta: {} })

    if (userContacts?.length === 0) {
        const payload = {
            phone_number: userData?.phoneNumber || null,
            email: userData?.email || null,
            link_precedence: Constants.DB.MODELS.CONTACTS.LINK_PRECEDENCE.PRIMARY,
            linked_id: null
        }
        let createdContactData: any = {};
        await asyncTryCatchHandler(async () => {
           createdContactData = await Repo.Contact.createContact(payload)
        }, { resourceType: 'USER', log: 'CONTACT', message: 'Error creating user contact', meta: {} })

        response ={
            primaryContactId: createdContactData?.id,
			emails: [userData?.email],
			phoneNumbers: [ userData?.phoneNumber],
			secondaryContactIds: []
        }
    } else{

        const phonePresent = userContacts?.filter((contact: any) => Number(contact?.phone_number) === Number(userData?.phoneNumber) && userData?.phoneNumber && contact?.phone_number)
        const emailPresent = userContacts?.filter((contact: any) => contact?.email === userData?.email && userData?.email && contact?.email )
        const bothEmailPhonePresent = userContacts?.filter((contact: any) => contact?.email === userData?.email && Number(contact?.phone_number) === Number(userData?.phoneNumber) && userData?.phoneNumber && userData?.email && contact?.email && contact?.phone_number )

        if (bothEmailPhonePresent?.length === 0) {
            const primaryContact = bothEmailPhonePresent?.find((contact: any) => contact?.link_precedence === Constants.DB.MODELS.CONTACTS.LINK_PRECEDENCE.PRIMARY)
            if(primaryContact?.id){
                const payload = {
                    phone_number: userData?.phoneNumber || null,
                    email: userData?.email || null,
                    link_precedence: Constants.DB.MODELS.CONTACTS.LINK_PRECEDENCE.SECONDARY,
                    linked_id: primaryContact?.id
                }
                let createdContactData: any = {}
                await asyncTryCatchHandler(async () => {
                    createdContactData = await Repo.Contact.createContact(payload)
                }, { resourceType: 'USER', log: 'CONTACT', message: 'Error creating user contact', meta: {} })

                const secondaryContacts = userContacts?.filter(contact => contact?.id !== primaryContact?.id)
                response ={
                    primaryContactId: primaryContact?.id,
                    emails: [primaryContact?.email, ...secondaryContacts?.map(contact => contact?.email), createdContactData?.email],
                    phoneNumbers: [ primaryContact?.phone_number, ...secondaryContacts?.map(contact => contact?.phone_number), createdContactData?.phone_number],
                    secondaryContactIds: [ ...secondaryContacts?.map(contact => contact?.id), createdContactData?.id]
                }
            }
        }

        if (((phonePresent?.length === 0 && emailPresent?.length !== 0) || (phonePresent?.length !== 0 && emailPresent?.length === 0)) && bothEmailPhonePresent?.length === 0) {
            const primaryContact = userContacts?.reduce((min, contact) => contact?.id < min.id ? contact : min)
            if(primaryContact?.id){
                const payload = {
                    phone_number: userData?.phoneNumber || null,
                    email: userData?.email || null,
                    link_precedence: Constants.DB.MODELS.CONTACTS.LINK_PRECEDENCE.SECONDARY,
                    linked_id: primaryContact?.id
                }

                let createdContactData: any = {}
                await asyncTryCatchHandler(async () => {
                    createdContactData = await Repo.Contact.createContact(payload)
                }, { resourceType: 'USER', log: 'CONTACT', message: 'Error creating user contact', meta: {} })

                const secondaryContacts = userContacts?.filter(contact => contact?.id !== primaryContact?.id)
                response ={
                    primaryContactId: primaryContact?.id,
                    emails: [primaryContact?.email, ...secondaryContacts?.map(contact => contact?.email), createdContactData?.email],
                    phoneNumbers: [ primaryContact?.phone_number, ...secondaryContacts?.map(contact => contact?.phone_number), createdContactData?.phone_number],
                    secondaryContactIds: [ ...secondaryContacts?.map(contact => contact?.id), createdContactData?.id]
                }
            }

            if (primaryContact?.id && primaryContact?.link_precedence !== Constants.DB.MODELS.CONTACTS.LINK_PRECEDENCE.PRIMARY) {
                const payload = {
                    link_precedence: Constants.DB.MODELS.CONTACTS.LINK_PRECEDENCE.PRIMARY,
                }
                await asyncTryCatchHandler(async () => {
                    return await Repo.Contact.updateBulkContactById([primaryContact?.id],payload)
                }, { resourceType: 'USER', log: 'CONTACT', message: 'Error updating user contacts', meta: {} })
            }
        }

        if ((phonePresent?.length !== 0 && emailPresent?.length !== 0) && bothEmailPhonePresent?.length === 0) {
            const primaryContact = userContacts?.reduce((min, contact) => contact?.id < min.id ? contact : min)
            const secondaryContacts = userContacts?.filter(contact => contact?.id !== primaryContact?.id)
            const secondaryContactIds = secondaryContacts?.map(contact => contact?.id)
            if(primaryContact?.id){
                const payload = {
                    link_precedence: Constants.DB.MODELS.CONTACTS.LINK_PRECEDENCE.SECONDARY,
                    linked_id: primaryContact?.id
                }
                await asyncTryCatchHandler(async () => {
                    return await Repo.Contact.updateBulkContactById(secondaryContactIds,payload)
                }, { resourceType: 'USER', log: 'CONTACT', message: 'Error updating user contacts', meta: {} })

                response ={
                    primaryContactId: primaryContact?.id,
                    emails: [primaryContact?.email, ...secondaryContacts?.map(contact => contact?.email)],
                    phoneNumbers: [ primaryContact?.phone_number, ...secondaryContacts?.map(contact => contact?.phone_number)],
                    secondaryContactIds: [ ...secondaryContacts?.map(contact => contact?.id)]
                }
            }
            if (primaryContact?.link_precedence !== Constants.DB.MODELS.CONTACTS.LINK_PRECEDENCE.PRIMARY) {
                const payload = {
                    link_precedence: Constants.DB.MODELS.CONTACTS.LINK_PRECEDENCE.PRIMARY,
                }
                await asyncTryCatchHandler(async () => {
                    return await Repo.Contact.updateBulkContactById([primaryContact?.id],payload)
                }, { resourceType: 'USER', log: 'CONTACT', message: 'Error updating user contacts', meta: {} })
            }
        }
    }

    return response
}

export { identifyUserService };