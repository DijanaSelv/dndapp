campaigns ##DONE
 └─ campaignId
     ├─ id: campaignId
     ├─ title: string
     ├─ description: string
     ├─ image: string
     ├─ location: string
     ├─ joinCode: string
     ├─ members
         └─ userId
             ├─ roles: { creator: true, dm: true, player: true }
             └─ character: characterId      

users ##DONE
 └─  userId
     ├─ email: string
     ├─ firstName: string
     ├─ lastName: string
     ├─ memberSince: string
     ├─ experience: string
     └─ campaigns
         └─ joined
             └─ campaignId: true
         └─ created
             └─ campaignId: true
    
characters
 └─ characterId
     ├─ ownerId: userId
     ├─ name: string
     ├─ ...... all the info needed
     └─ linkedCampaigns //to list where the character has joined #TODO: 
         └─ campaignId: true

publicNotes
    └─ campaignId
        └─ noteId
            ├─ title: string
            ├─ content: string/innerhtml?
            ├─ createdBy: userId
            ├─ type: lore/npc/location/misc
            ├─ images
            |    └─ "string": true
            └─ timestamp: number

privateNotes
 └─ userId
     └─ campaignId
         └─ noteId
             ├─ title: string
             ├─ content: string
             └─ timestamp: number

shops  ##DONE
    └─ campaignId
        └─ shopId
            ├─ title: string
            ├─ description: string
            ├─ image: string
            └─ items: { id: { name, price, description, amount, id, url(for the api) } }


chat
    └─ campaignId
        └─ initiative :TODO: this should be an array maybe?
            └─ 0: "string"
            └─ 1: "string"
            └─ 2: "string"
        └─ messages
            └─ messageId
                ├─ character: string
                ├─ content: string/number
                ├─ details: string
                ├─ type: roll/message
                └─ uid: string





Vo idnina ova:
posts
 └─ postId
     ├─ authorId: userId
     ├─ type: "lookingForPlayers" | "lookingForCampaign"
     ├─ content: string
     ├─ timestamp: number
     └─ interestedUsers
         └─ userId: true

