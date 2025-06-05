import Constants from "../Constants/index.ts"
import { DB } from "../models/index.ts"

class contactRepo {
    static async getContactByEmailOrPhoneNumber (email: string, phoneNumber: number) {
        const contacts = await DB.Main('fluxkart.contact').select('*')
            .queryContext({ queryName: 'getContactByEmailOrPhoneNumber' })
            .where(function () {
                this.where('email', email)
                    .orWhere('phone_number', phoneNumber)
            })

        const directPrimaryContactIds = contacts?.filter((contact: any) => contact?.link_precedence === Constants.DB.MODELS.CONTACTS.LINK_PRECEDENCE.PRIMARY).map((item: any) => item?.id) || []
        const indirectPrimaryContactIds = contacts?.map((contact: any) => contact?.linked_id)
        const primaryContactIds = Array.from(new Set([...directPrimaryContactIds, ...indirectPrimaryContactIds]))

        const primaryContacts = await DB.Main('fluxkart.contact').select('*')
            .queryContext({ queryName: 'getContactByEmailOrPhoneNumber' })
            .whereIn('id', primaryContactIds)

        const secondaryContacts = await DB.Main('fluxkart.contact').select('*')
            .queryContext({ queryName: 'getContactByEmailOrPhoneNumber' })
            .whereIn('linked_id', primaryContactIds)
            .where('link_precedence', Constants.DB.MODELS.CONTACTS.LINK_PRECEDENCE.SECONDARY)

        const userContacts = [...primaryContacts, ...secondaryContacts]
        return userContacts || []
    }

    static async createContact (contactData: any) {
        const newContact = await DB.Main('fluxkart.contact').insert(contactData)
        .queryContext({ queryName: 'createContact' })
        .returning('*')
        return newContact[0] || null
    }

    static async updateBulkContactById (contactIds: any, payload: any) {
        const updatedContacts = await DB.Main('fluxkart.contact').update(payload)
        .queryContext({ queryName: 'updateBulkContactById' })
        .whereIn('id', contactIds)
        .returning('*')
        return updatedContacts || []
    }
}

export default contactRepo