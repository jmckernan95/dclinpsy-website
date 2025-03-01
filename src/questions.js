const questions = [
    {
      scenario: "You have been providing therapy to a client for six months, and they have made significant progress. In your final session, they present you with a gift-wrapped package containing an expensive watch that you know costs at least £300. They mention that they wanted to thank you for \"changing their life.\"",
      options: [
        "Thank the client but explain that you cannot accept expensive gifts due to professional boundaries, and suggest alternative ways they might express their gratitude.",
        "Suggest that instead of giving you a gift, they could write a letter of feedback about the service that could help improve care for others.",
        "Politely refuse the gift, explaining it's against your organization's policy to accept gifts valued over a certain amount.",
        "Accept the gift but document it thoroughly in your notes and inform your supervisor.",
        "Accept the gift to avoid appearing ungrateful, but later donate it to charity."
      ],
      idealRanking: [1, 2, 3, 4, 5],
      explanations: [
        "This option directly addresses the boundary concern while validating the client's gratitude. The BPS Code of Ethics emphasizes maintaining appropriate professional boundaries, and this response balances compassionate understanding with clear limits. By suggesting alternative expressions of gratitude, this approach provides therapeutic guidance while modeling appropriate professional relationships, which is essential for maintaining the integrity of the therapeutic alliance.",
        "This response redirects the client's gratitude toward a constructive alternative that benefits the wider service. The HCPC Standards of Conduct, Performance and Ethics encourage service improvement and feedback collection as part of professional practice. This approach demonstrates clinical wisdom by transforming a potential boundary issue into an opportunity for the client to contribute positively to others' care, reinforcing therapeutic gains through altruistic action.",
        "This response maintains professional boundaries by referencing organizational policy as the rationale. The BPS guidelines acknowledge the importance of working within institutional frameworks while maintaining ethical standards. While this approach effectively maintains the boundary, it may feel somewhat impersonal to the client at this significant moment of therapy conclusion, potentially missing an opportunity for a more relationally-focused intervention that could reinforce therapeutic learning.",
        "This approach recognizes the need for transparency and supervision but fails to address the boundary issue directly. The HCPC Standards emphasize the importance of supervision and documentation, but accepting expensive gifts risks creating inappropriate dependency or dual relationships. This response prioritizes avoiding client disappointment over maintaining clear professional boundaries, which could compromise the clarity of the therapeutic relationship and potentially model unhelpful patterns for the client.",
        "This is the least appropriate action as it creates a significant boundary violation without transparency. The BPS Code of Ethics emphasizes honesty and integrity in professional relationships, and this approach lacks both. Accepting the gift to avoid discomfort, then disposing of it without the client's knowledge, fails to model healthy boundaries and honest communication, and misses an important therapeutic opportunity to address the meaning behind the gift-giving in a way that supports the client's ongoing growth."
      ],
      category: "Professional Boundaries"
    },
    {
      scenario: "You are at a local supermarket during the weekend when you encounter a current client who is shopping with their family. The client approaches you enthusiastically and invites you to join them for coffee at the café inside the store.",
      options: [
        "Explain that you'd be happy to discuss anything they'd like during your next session, but that you need to maintain professional boundaries outside of the clinical setting.",
        "Politely decline, briefly explaining that it would be inappropriate to socialize outside of therapy sessions, and remind them of your next scheduled appointment.",
        "Suggest that they could invite a member of their support network for coffee instead, as building their support system is important.",
        "Make an excuse about being in a hurry and needing to leave.",
        "Accept the invitation but keep the conversation general and avoid discussing therapy."
      ],
      idealRanking: [1, 2, 3, 4, 5],
      explanations: [
        "This response clearly articulates professional boundaries while validating the client's desire to connect. The BPS Practice Guidelines emphasize transparency about the therapeutic framework, including clear boundaries around the professional relationship. This approach models healthy boundary-setting while maintaining therapeutic rapport, acknowledging the client's feelings without creating confusion about the nature of the relationship, and reinforces the therapeutic container as the appropriate context for their work together.",
        "This approach maintains professional boundaries with a clear but concise explanation. The HCPC Standards of Conduct encourage professional clarity and appropriate management of therapeutic relationships. While effectively maintaining boundaries, this response is slightly less therapeutic than the top option because it misses an opportunity to more fully validate the client's feelings about the encounter before redirecting to the established therapeutic framework, but still demonstrates good professional judgment.",
        "This response attempts to redirect the client to more appropriate social supports. The BPS Code of Ethics supports fostering client autonomy and social connection. While this suggestion has therapeutic merit in encouraging the development of natural support systems, it may come across as deflecting in this spontaneous social situation, and doesn't directly address the boundary issue as clearly as the higher-ranked options, potentially creating confusion about why the therapist is unavailable.",
        "This approach avoids direct boundary-setting through dishonesty. The BPS ethical principles emphasize integrity in professional interactions, including honesty with clients. This response fails to use the encounter as an opportunity for modeling transparent communication about professional boundaries, potentially leaving the client confused about the rejection without understanding the professional context, and misses a chance to reinforce the therapeutic frame in a respectful manner.",
        "This is the least appropriate action as it significantly blurs professional boundaries. The HCPC Standards clearly emphasize maintaining appropriate professional relationships with service users. Accepting this social invitation risks creating dual relationships and could confuse the therapeutic alliance, potentially impacting clinical effectiveness. This approach prioritizes avoiding momentary discomfort over maintaining the clarity and integrity of the professional relationship that best serves the client's therapeutic needs."
      ],
      category: "Professional Boundaries"
    },
    {
      scenario: "You are seeing a 45-year-old client who has been making good progress in therapy for anxiety. During your sixth session, they mention that they have tickets to a play that you previously mentioned you were interested in seeing. They offer you their spare ticket, explaining that their friend canceled last minute and it would \"be a shame to waste it.\"",
      options: [
        "Thank them for the kind offer but explain that accepting would go beyond the professional therapeutic relationship, which needs to be maintained for their benefit.",
        "Decline the ticket, and explore with the client what this offer might mean in the context of your therapeutic relationship.",
        "Politely decline without providing a reason, then change the subject back to the therapy session.",
        "Accept the ticket but insist on paying for it at full price.",
        "Accept the invitation, reasoning that the therapeutic relationship is strong enough to withstand some boundary flexibility."
      ],
      idealRanking: [1, 2, 3, 4, 5],
      explanations: [
        "This response maintains clear boundaries while providing a therapeutic rationale that centers the client's wellbeing. The BPS Code of Ethics emphasizes maintaining appropriate professional relationships and avoiding dual relationships that could compromise therapeutic effectiveness. This approach demonstrates clinical wisdom by framing the boundary not as a rejection but as an aspect of care, helping the client understand that the therapeutic relationship has specific parameters designed to support their progress, which models healthy professional boundaries.",
        "This response uses the boundary situation as a therapeutic opportunity. The HCPC Standards of Proficiency for Psychologists highlight the importance of using appropriate therapeutic techniques to explore and understand client behavior. By turning the offer into an exploration of the therapeutic relationship dynamics, this approach maintains boundaries while deepening therapeutic work, demonstrating sophisticated clinical practice that uses all aspects of the therapeutic interaction as potential material for growth and insight.",
        "This approach maintains the boundary but misses the therapeutic opportunity presented. The BPS guidelines acknowledge the importance of clear boundaries but also emphasize therapeutic engagement with client behavior. While this response successfully prevents boundary crossing, the lack of explanation and exploration represents a missed opportunity for therapeutic work on relationship patterns, potentially leaving the client feeling rejected without understanding the professional context of the refusal.",
        "This response attempts to mitigate the boundary crossing through financial transaction but still blurs professional lines. The HCPC Standards emphasize maintaining appropriate professional relationships, which extends beyond financial considerations. This approach fails to recognize that accepting social invitations creates dual relationships regardless of payment, potentially confusing the therapeutic framework and setting a precedent for further boundary testing, which could ultimately undermine the therapeutic work.",
        "This is the least appropriate action as it directly violates professional boundaries. The BPS Code of Ethics clearly prohibits dual relationships that could exploit or harm clients. This approach prioritizes potential short-term rapport over maintaining the therapeutic framework necessary for effective long-term work, demonstrating poor clinical judgment that could lead to ethical complications and confusion about the nature and purpose of the therapeutic relationship."
      ],
      category: "Professional Boundaries"
    },
    {
      scenario: "During a therapy session for depression, your client directly asks you if you've ever experienced depression yourself. They say it would help them to know if you really understand what they're going through.",
      options: [
        "Acknowledge their question and curiosity, then explore what knowing this information would mean for them and their therapy.",
        "Explain that you prefer to keep the focus on them during sessions, while assuring them that you have both professional training and experience to help with depression.",
        "Share briefly that you understand depression from both professional and personal perspectives, without going into specific details about your own experiences.",
        "Directly state that you cannot answer personal questions as it crosses professional boundaries, and redirect to the session agenda.",
        "Share your own detailed personal experience with depression to build rapport and demonstrate understanding."
      ],
      idealRanking: [1, 2, 3, 4, 5],
      explanations: [
        "This response skillfully addresses the underlying need behind the question rather than simply answering or deflecting it. The BPS Practice Guidelines emphasize therapeutic exploration of client communications to understand their meaning and function. This approach demonstrates advanced clinical skill by using the question as an opportunity to deepen therapeutic understanding, exploring what drives the client's need for therapist disclosure, which could reveal important insights about their experience of depression and concerns about being understood.",
        "This response maintains appropriate boundaries while providing reassurance about therapeutic competence. The HCPC Standards emphasize keeping the focus on client needs within professional parameters. This approach balances maintaining the therapeutic frame with validating the client's desire for connection and understanding, providing enough reassurance about the therapist's capacity to help without shifting the focus away from the client's experience, which maintains the effectiveness of the therapeutic work.",
        "This response provides limited self-disclosure that aims to build therapeutic alliance. The BPS guidelines acknowledge that judicious self-disclosure may occasionally serve therapeutic goals. While this approach attempts to balance validation with boundaries, even minimal self-disclosure shifts the focus partially to the therapist and risks establishing a pattern of client curiosity about the therapist's experiences, potentially distracting from the therapeutic work focused on the client's unique experience of depression.",
        "This approach maintains strict boundaries but lacks therapeutic sensitivity. The HCPC Standards encourage clear boundaries but also emphasize respect and sensitivity in therapeutic interactions. While this response successfully prevents inappropriate self-disclosure, the abrupt redirection without exploring the meaning behind the question could feel rejecting to a vulnerable client seeking connection and understanding, potentially damaging the therapeutic alliance at a moment when validation is particularly important.",
        "This is the least appropriate action as it shifts focus substantially from client to therapist. The BPS Code of Ethics cautions against self-disclosure that serves therapist rather than client needs. Extensive personal disclosure risks role reversal where the client becomes concerned about the therapist, creates inappropriate intimacy that blurs professional boundaries, and potentially establishes unhelpful comparison between experiences rather than focusing on the client's unique depression experience, undermining the therapeutic framework."
      ],
      category: "Professional Boundaries"
    },
    {
      scenario: "A client you've been seeing for anxiety has sent you a friend request on a social media platform. You receive this notification on your personal phone during their session.",
      options: [
        "Bring up the request during the session, explain your policy on social media connections with clients, and discuss the therapeutic boundaries this helps maintain.",
        "Decline the request after the session without discussing it with the client.",
        "Tell the client immediately that you've received their request and will need to decline it, then continue with the session.",
        "Ignore the request without mentioning it, and continue with the session as planned.",
        "Accept the request but adjust your privacy settings so the client has limited access to your personal information."
      ],
      idealRanking: [1, 2, 3, 4, 5],
      explanations: [
        "This response addresses the situation therapeutically while maintaining clear boundaries. The BPS Practice Guidelines emphasize transparency about the therapeutic framework and using boundary issues to deepen therapeutic work. This approach demonstrates best practice by using the friend request as an opportunity to explore the meaning of therapeutic boundaries, helping the client understand the rationale behind these boundaries rather than experiencing them as rejection, which models healthy professional relationships while maintaining clinical effectiveness.",
        "This approach maintains boundaries but misses the therapeutic opportunity presented. The HCPC Standards support maintaining appropriate professional relationships, including digital boundaries. While this response effectively prevents inappropriate social media connection, not addressing it therapeutically represents a missed opportunity to explore what motivated the client's request and to help them understand the parameters of the therapeutic relationship, though it does maintain boundaries without disrupting the session flow.",
        "This response addresses the boundary directly but potentially disrupts the therapeutic process. The BPS guidelines encourage maintaining boundaries while being sensitive to session dynamics. Addressing the issue immediately demonstrates transparency but may interrupt important therapeutic work in progress, and the immediate response without exploration could feel abrupt to the client, potentially affecting the therapeutic alliance without the benefit of a thoughtful discussion about professional boundaries.",
        "This approach avoids addressing an important boundary issue. The HCPC Standards emphasize clear communication and transparency in professional relationships. By ignoring the request completely, this response fails to use it as a therapeutic opportunity and leaves the client without understanding about why their request remains unanswered, potentially creating confusion or feelings of rejection that could impact the therapeutic alliance and leaving an unspoken issue affecting the therapeutic relationship.",
        "This is the least appropriate action as it violates professional boundaries by creating a dual relationship. The BPS Code of Ethics explicitly cautions against relationships that could blur therapeutic boundaries. Accepting the request, even with privacy limitations, creates inappropriate social connection outside the therapeutic context, potentially giving the client access to personal information about the therapist, and setting a precedent that undermines the containment necessary for effective therapeutic work."
      ],
      category: "Professional Boundaries"
    },
    {
      scenario: "You've been working with a 17-year-old client in CAMHS who will soon transition to adult services. In your last session, they ask for your personal email address so they can \"stay in touch\" and let you know how they're doing after transition.",
      options: [
        "Explore the client's feelings about ending therapy and transitioning services, acknowledging their desire to maintain connection, while explaining why providing personal contact information isn't appropriate.",
        "Provide the general service email instead, explaining they can send updates through official channels if they wish.",
        "Give them your professional email, telling them they can contact you for the next month only to ensure a smooth transition.",
        "Firmly refuse, stating it's against policy to maintain contact after discharge.",
        "Provide your personal email but set clear boundaries about when and how often they can contact you."
      ],
      idealRanking: [1, 2, 3, 4, 5],
      explanations: [
        "This response addresses the underlying anxiety about transition while maintaining appropriate boundaries. The BPS Practice Guidelines emphasize the importance of therapeutic endings and exploring client feelings about termination. This approach demonstrates clinical wisdom by recognizing that the request likely reflects concerns about the upcoming transition rather than simply wanting contact, using it as an opportunity to process feelings about ending while still maintaining clear professional boundaries that support the client's move toward independence.",
        "This approach offers an appropriate alternative that maintains professional boundaries. The HCPC Standards support maintaining appropriate channels of communication within professional frameworks. This response balances acknowledging the client's desire for continued connection with ensuring that any future contact occurs within appropriate service parameters, which models proper professional relationships while offering some continuity through the transition phase, supporting both client needs and professional boundaries.",
        "This response attempts to support transition while setting time limits on continued contact. The BPS guidelines acknowledge that transitions may sometimes require additional support with clear parameters. While this approach tries to balance support with boundaries, offering time-limited professional contact could potentially complicate the transition process by delaying full engagement with adult services and creating an additional ending later, though the professional (rather than personal) email and time limitation provide some appropriate containment.",
        "This approach maintains clear boundaries but lacks therapeutic sensitivity. The HCPC Standards emphasize clear communication about service limitations but also require empathy and sensitivity. While this response effectively prevents inappropriate post-discharge contact, the abrupt manner without exploring the underlying feelings or offering alternatives could leave the client feeling rejected at a vulnerable transition point, missing an opportunity to process feelings about ending that could support their therapeutic gains.",
        "This is the least appropriate action as it creates a significant boundary violation despite attempted limitations. The BPS Code of Ethics strongly cautions against dual relationships and personal contact outside professional contexts. Sharing personal contact details, even with stated restrictions, blurs professional boundaries, potentially creates dependency that could interfere with the client's transition to adult services, and sets a precedent that undermines the clear professional framework necessary for therapeutic effectiveness."
      ],
      category: "Professional Boundaries"
    },
    {
      scenario: "You are conducting home visits with a client who has mobility issues. During your fifth visit, you notice they have printed and framed a photo of you that they took without your knowledge during a previous session, displayed prominently in their living room.",
      options: [
        "Sensitively discuss appropriate boundaries in the therapeutic relationship, including consent for taking photographs, while exploring what the photo represents for them.",
        "Express discomfort immediately and ask them to remove the photo while you are present.",
        "End the session early, explaining that you need to consult with your supervisor about continuing home visits.",
        "Request that all future appointments take place at the clinic instead of their home.",
        "Pretend not to notice the photo and continue with the session as planned."
      ],
      idealRanking: [1, 2, 3, 4, 5],
      explanations: [
        "This response addresses the boundary violation therapeutically while establishing necessary limits. The BPS Practice Guidelines emphasize exploring the meaning behind client behaviors that challenge boundaries. This approach demonstrates sophisticated clinical practice by using this boundary crossing as an opportunity to understand the client's needs and relationship patterns, while still clearly establishing appropriate consent requirements, which balances therapeutic exploration with necessary boundary-setting to maintain a safe therapeutic frame.",
        "This approach directly addresses the boundary violation with clear expectations. The HCPC Standards support maintaining appropriate professional boundaries and addressing violations promptly. While this response effectively establishes boundaries around consent and personal imagery, the immediate focus on removal without exploration may miss an opportunity to understand the psychological meaning behind this behavior, though it appropriately communicates that this boundary crossing requires immediate attention rather than being overlooked.",
        "This response acknowledges the seriousness of the boundary violation and the need for supervision. The BPS guidelines emphasize the importance of supervision for complex boundary issues. While ending the session may be premature without trying to address the issue first, this approach appropriately recognizes that unexpected boundary violations may require consultation before proceeding, especially in the less-contained home environment, demonstrating awareness of when additional professional support is needed for ethical decision-making.",
        "This approach changes the therapeutic setting without addressing the underlying boundary issue. The HCPC Standards support appropriate adjustments to therapeutic arrangements when necessary. While relocating sessions to a clinical setting might provide more structure and clearer boundaries, making this change without discussing the photograph directly avoids addressing the client's behavior and its meaning, potentially leaving them confused about the sudden change in arrangements without therapeutic understanding of the boundary issue involved.",
        "This is the least appropriate action as it fails to address a significant boundary violation. The BPS Code of Ethics emphasizes addressing boundary issues promptly and clearly. Ignoring the unauthorized photograph tacitly condones this behavior, potentially enabling further boundary violations and missing crucial therapeutic information about the client's understanding of the therapeutic relationship, while also creating an uncomfortable dynamic where an obvious issue remains unaddressed, undermining the authenticity necessary for effective therapy."
      ],
      category: "Professional Boundaries"
    },
    {
      scenario: "You are attending a professional conference and recognize one of the other attendees as a former client you worked with two years ago. They approach you during the lunch break, mention they're now studying psychology, and ask if you'd be willing to provide mentoring or career advice.",
      options: [
        "Politely acknowledge them and explain that while you're pleased about their career path, ethical guidelines restrict dual relationships with former clients, and suggest appropriate professional networking alternatives.",
        "Tell them you'd be happy to connect them with a colleague who could provide mentoring.",
        "Agree to a one-time coffee meeting to discuss their career path generally.",
        "Pretend not to recognize them and avoid interaction.",
        "Offer to exchange business cards and establish a mentoring relationship."
      ],
      idealRanking: [1, 2, 3, 4, 5],
      explanations: [
        "This response maintains appropriate boundaries while providing supportive guidance. The BPS Code of Ethics clearly addresses the risks of dual relationships, even with former clients. This approach demonstrates professional integrity by acknowledging the client's career development positively while clearly articulating ethical limitations, and offering constructive alternatives that support their professional growth without creating boundary confusion, modeling ethical decision-making that the former client can apply in their own developing professional practice.",
        "This approach offers practical support while maintaining appropriate boundaries. The HCPC Standards encourage supporting client welfare while respecting professional limitations. This response balances being helpful to the former client's professional development with maintaining clear boundaries in your own relationship with them, providing a constructive solution that both respects ethical guidelines and supports their growth through appropriate professional channels rather than a potentially problematic dual relationship.",
        "This response attempts to limit boundary crossing but still creates a dual relationship. The BPS guidelines acknowledge that boundaries with former clients require careful consideration based on multiple factors. While attempting to be helpful through limited contact, even a single meeting establishes a precedent for a relationship outside the therapeutic context, potentially creating confusion about roles and boundaries, especially given the power differential that persists even after therapeutic work concludes, though the one-time limitation provides some containment.",
        "This approach avoids the boundary issue through behavior that lacks professional integrity. The HCPC Standards emphasize honesty and respect in all professional interactions. While this response prevents boundary crossing, pretending not to recognize a former client could be experienced as rejecting and hurtful, especially in a professional context where they are seeking legitimate career guidance, and fails to model the ethical, transparent communication that forms the foundation of good professional practice in psychology.",
        "This is the least appropriate action as it creates a clear dual relationship with a former client. The BPS Code of Ethics explicitly cautions against relationships that could exploit therapeutic knowledge of clients or create role confusion. Establishing an ongoing mentoring relationship significantly blurs boundaries between the therapeutic relationship and the new professional connection, potentially introducing complex dynamics based on previous therapeutic knowledge of the former client, and fails to recognize the inherent power imbalance that persists beyond therapy."
      ],
      category: "Professional Boundaries"
    },
    {
      scenario: "You've been seeing a client with social anxiety for several months. They mention that they've registered for a half-marathon charity event and ask if you would consider joining their team, explaining it would give them confidence to have you there.",
      options: [
        "Acknowledge their progress and courage in signing up for the event, explain why you cannot participate due to professional boundaries, and explore alternative supports they could involve.",
        "Decline without explanation and redirect the conversation back to their therapy goals.",
        "Tell them you'll think about it and give them an answer in your next session.",
        "Suggest that you could attend as a spectator instead of a participant to show support.",
        "Accept the invitation, reasoning that participating in a public charity event could be therapeutic for the client."
      ],
      idealRanking: [1, 2, 3, 4, 5],
      explanations: [
        "This response validates the client's progress while maintaining appropriate boundaries. The BPS Practice Guidelines emphasize recognizing client achievements while maintaining the therapeutic framework. This approach demonstrates clinical sophistication by framing the boundary as supportive rather than rejecting, and using it to explore expanding the client's support network beyond therapy, which aligns with therapeutic goals for social anxiety while preserving the professional relationship necessary for effective ongoing work.",
        "This approach maintains boundaries but misses the therapeutic opportunity. The HCPC Standards support appropriate professional boundaries in therapeutic relationships. While this response effectively prevents boundary crossing, the lack of explanation and exploration represents a missed opportunity to validate the client's progress and discuss the meaning of their invitation, though returning focus to therapy goals appropriately maintains the therapeutic framework and prevents role confusion that could undermine treatment.",
        "This response delays an important boundary decision inappropriately. The BPS guidelines encourage clarity and transparency in therapeutic relationships. While considering complex issues carefully has merit, this approach creates unnecessary ambiguity about professional boundaries that could foster false hope or expectation, missing an opportunity to use the current session to process feelings about the invitation and explore alternative supports, though it does avoid an immediate rejection that might feel hurtful.",
        "This approach attempts compromise but still blurs professional boundaries. The HCPC Standards emphasize maintaining appropriate professional relationships confined to therapeutic contexts. This proposed solution creates a social dimension to the therapeutic relationship that extends beyond professional parameters, potentially creating role confusion for a client with social anxiety who might focus on the therapist's presence rather than their own experience, though the intention to be supportive acknowledges the client's achievement in confronting their anxiety.",
        "This is the least appropriate action as it creates a significant boundary crossing justified by therapeutic rationale. The BPS Code of Ethics cautions against dual relationships even when seemingly beneficial. Participating as a team member establishes a social relationship outside the therapeutic context, potentially creating dependency rather than fostering the client's independence in managing social anxiety, and fundamentally changes the nature of the professional relationship in ways that could undermine therapeutic progress and create role confusion."
      ],
      category: "Professional Boundaries"
    },
    {
      scenario: "A client you've been treating for bereavement following the death of their spouse discloses that they've been finding your sessions so helpful that they've written a poem about their therapeutic journey and would like to include it (with your name) in a self-published collection they're creating.",
      options: [
        "Express appreciation for the sentiment while explaining the importance of confidentiality and professional boundaries, suggesting they could include the poem without identifying you.",
        "Suggest they change your name in the poem and create a fictional therapist character instead.",
        "Request to read the poem first before making a decision.",
        "Firmly refuse, stating that any public acknowledgment of the therapeutic relationship is inappropriate.",
        "Give permission for them to publish the poem with your name, seeing it as a positive expression of their therapeutic progress."
      ],
      idealRanking: [1, 2, 3, 4, 5],
      explanations: [
        "This response balances validation of the client's creative expression with appropriate professional boundaries. The BPS Practice Guidelines emphasize maintaining confidentiality while supporting client autonomy and growth. This approach demonstrates clinical wisdom by acknowledging the therapeutic importance of the creative work while providing clear guidance on maintaining appropriate professional boundaries, allowing the client to express their therapeutic journey without compromising the professional nature of the relationship or breaching confidentiality standards.",
        "This approach offers a creative solution that maintains confidentiality. The HCPC Standards support protecting client confidentiality while respecting their autonomy. This response provides a constructive alternative that allows the client to publish their meaningful creative work while maintaining appropriate professional boundaries through fictionalization, recognizing the therapeutic value of their expression while ensuring that the actual therapeutic relationship remains appropriately private rather than becoming publicly identified.",
        "This response acknowledges the need to assess content before determining appropriate boundaries. The BPS guidelines support making informed decisions about boundary questions based on specific circumstances. While this approach appropriately recognizes that the content of the poem might influence boundary considerations, it potentially creates expectations that permission might be granted depending on content, which could lead to disappointment if, after reading, boundaries still necessitate declining permission for them to use your real name.",
        "This approach maintains clear boundaries but lacks therapeutic sensitivity. The HCPC Standards emphasize maintaining confidentiality while communicating respectfully. While this response effectively prevents inappropriate public disclosure, the firm refusal without acknowledging the positive sentiment behind the creative expression could feel invalidating to a client processing grief, missing an opportunity to appreciate their therapeutic progress while still maintaining appropriate boundaries through more collaborative problem-solving.",
        "This is the least appropriate action as it permits public disclosure of the therapeutic relationship. The BPS Code of Ethics emphasizes protecting client confidentiality and maintaining appropriate professional boundaries. Allowing public identification compromises therapist anonymity and could be seen as exploiting the client's gratitude for personal recognition, while also setting a precedent that could confuse boundaries for both this client and potentially others who might learn of this arrangement, fundamentally undermining the professional framework of the therapeutic relationship."
      ],
      category: "Professional Boundaries"
    }
  ];
  
  export default questions;