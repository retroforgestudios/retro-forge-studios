// Shared labels keep the form and emailed answers in sync.
export const guideSections = [
  {
    "id": "guide-1",
    "title": "Website Ownership and Client Setup Guide",
    "blocks": [
      [
        "p",
        "A practical guide for clients working with Retro Forge Studios. It explains ownership, invited developer access, setup responsibilities, deployment, launch and ongoing maintenance."
      ],
      [
        "h",
        "The recommended arrangement"
      ],
      [
        "p",
        "Your business owns its GitHub organization, Cloudflare account, domain and supporting services. Retro Forge Studios works through invited access using its own logins. You retain billing control, account recovery and the ability to appoint another developer."
      ],
      [
        "table",
        [
          "Asset or service",
          "Client controls",
          "Retro Forge Studios access"
        ],
        [
          [
            "Domain registration",
            "Registration, renewals, billing and recovery",
            "Delegated access when needed"
          ],
          [
            "GitHub organization and repository",
            "Organization ownership, source code and history",
            "Website repository access"
          ],
          [
            "Cloudflare account and Pages",
            "Account administration, hosting and billing",
            "Hosting configuration and deployment"
          ],
          [
            "Forms CMS booking and payments",
            "Business accounts, subscriptions and data",
            "Invited access as agreed"
          ],
          [
            "Analytics and Search Console",
            "Business property ownership",
            "Appropriate management access"
          ],
          [
            "AI development tools",
            "Approval of project data shared with AI",
            "Development within agreed scope"
          ]
        ]
      ],
      [
        "h",
        "Ownership terms"
      ],
      [
        "p",
        "Account ownership and intellectual-property ownership are separate. The project agreement should define ownership of delivered code, copy, designs, reusable templates and third-party licenses. Use individual logins and invitations rather than shared passwords."
      ],
      [
        "p",
        "Client or business  __________________________________________<br/>Project contact  _____________________________________________<br/>Target launch date  __________________________________________"
      ]
    ]
  },
  {
    "id": "guide-2",
    "title": "Client account setup checklist",
    "blocks": [
      [
        "p",
        "Complete these steps before development starts. Existing business-owned accounts can be used when access and recovery details are current."
      ],
      [
        "h",
        "GitHub ownership"
      ],
      [
        "c",
        "Create or use a personal GitHub login with an email you control. Enable two-factor authentication and save recovery codes."
      ],
      [
        "c",
        "Create or use the business GitHub organization. Keep a client representative as Owner; add a second trusted client owner where practical."
      ],
      [
        "c",
        "Create a private website repository such as business-name/website, or authorize Retro Forge Studios to create it within your organization."
      ],
      [
        "c",
        "Invite <b>retroforgestudios</b> to the repository. Start with Write access. Grant repository Admin only when configuration or access-management tasks require it, then review that permission."
      ],
      [
        "small",
        "Organization Owner access is normally unnecessary for the developer. Repository roles can be assigned to outside collaborators. See reference 1."
      ],
      [
        "h",
        "Cloudflare ownership"
      ],
      [
        "c",
        "Create or use a business-controlled Cloudflare account. Enable two-factor authentication and save recovery information."
      ],
      [
        "c",
        "Keep a client representative as Super Administrator. Add your own billing details if paid services are needed."
      ],
      [
        "c",
        "Invite <b>jgregory@retroforgestudios.com</b> through account member management. Review roles and resource scopes."
      ],
      [
        "small",
        "Suggested starting role: Workers Platform Admin includes Pages and other developer services. It is broader than one website. Review available scopes, especially if the account holds other systems. Super Administrator should not be granted simply to manage a website. See references 2 and 3."
      ],
      [
        "h",
        "Domain and supporting services"
      ],
      [
        "c",
        "Confirm registrar access and identify who manages business email, DNS and current hosting."
      ],
      [
        "c",
        "Identify analytics, forms, booking, CRM and payment services. Create new business-owned accounts and invite the developer as needed."
      ],
      [
        "c",
        "Supply brand assets and approved content. Name one person who approves scope, design changes and launch."
      ]
    ]
  },
  {
    "id": "guide-3",
    "title": "Developer setup and release workflow",
    "blocks": [
      [
        "p",
        "For a typical business website, use the native Cloudflare Pages GitHub integration. Both the source repository and Pages project should live in the client environment."
      ],
      [
        "h",
        "Retro Forge Studios setup checklist"
      ],
      [
        "c",
        "Accept invitations and verify the correct client GitHub organization and Cloudflare account before creating resources."
      ],
      [
        "c",
        "Create the project in the client repository. Add a README covering local development, builds, deployment and maintenance."
      ],
      [
        "c",
        "Have the client GitHub owner approve or install the Cloudflare Workers and Pages GitHub app for the selected website repository."
      ],
      [
        "c",
        "In the client Cloudflare account, create a Pages project connected to Git and select the client repository."
      ],
      [
        "c",
        "Set the framework, build command, output directory and runtime version. Explicitly set main as the production branch."
      ],
      [
        "c",
        "Configure branch and pull-request previews. Add required variables and secrets to the correct production or preview environment."
      ],
      [
        "c",
        "Test a real commit through preview review and production deployment. Document how to restore a working version."
      ],
      [
        "h",
        "How changes reach the live website"
      ],
      [
        "table",
        [
          "Step",
          "Action"
        ],
        [
          [
            "1  Request",
            "The client describes the change and business purpose."
          ],
          [
            "2  Develop",
            "Retro Forge Studios develops with AI on a separate branch."
          ],
          [
            "3  Preview",
            "Push to GitHub. Cloudflare builds a review URL."
          ],
          [
            "4  Review",
            "Test the result and collect approval where required."
          ],
          [
            "5  Publish",
            "Merge into main. Cloudflare deploys the live website."
          ]
        ]
      ],
      [
        "small",
        "Agree whether every change requires approval or routine maintenance may be released under ongoing authorization. Git integration provides previews and deployment status. See reference 4."
      ],
      [
        "small",
        "AI and confidential information: Explain which tools receive code or content. Limit access to required repositories where supported. Keep passwords, production secrets and customer records out of prompts and source control."
      ]
    ]
  },
  {
    "id": "guide-4",
    "title": "Launch responsibilities and checks",
    "blocks": [
      [
        "p",
        "The client approves business content and release timing. Retro Forge Studios implements and verifies the website."
      ],
      [
        "table",
        [
          "Task",
          "Retro Forge Studios",
          "Client"
        ],
        [
          [
            "Scope and design",
            "Document scope, sitemap and implementation",
            "Approve budget, scope and design"
          ],
          [
            "Copy and imagery",
            "Prepare agreed material and layouts",
            "Supply or approve accuracy and usage rights"
          ],
          [
            "Forms and notifications",
            "Configure and test real delivery",
            "Confirm recipients and follow-up process"
          ],
          [
            "Quality checks",
            "Test mobile, keyboard use, accessibility and browsers",
            "Review key visitor journeys"
          ],
          [
            "Existing URLs",
            "Map and implement redirects",
            "Identify valuable existing pages"
          ],
          [
            "Search setup",
            "Configure metadata, sitemap and indexing",
            "Approve business and location details"
          ],
          [
            "Analytics and integrations",
            "Connect and test",
            "Own accounts and approve access"
          ],
          [
            "Domain and DNS",
            "Plan and implement changes",
            "Approve timing and provide access"
          ],
          [
            "Go live",
            "Deploy and verify the live website",
            "Give final launch approval"
          ]
        ]
      ],
      [
        "h",
        "Domain and email continuity"
      ],
      [
        "c",
        "Record existing DNS before changes. Preserve email records including MX, SPF, DKIM and DMARC."
      ],
      [
        "c",
        "Add the domain through Pages Custom domains. Confirm HTTPS and choose the preferred www or non-www address."
      ],
      [
        "small",
        "A Pages apex domain such as example.com requires Cloudflare nameservers. A subdomain can use external DNS with the appropriate CNAME setup. See reference 5."
      ],
      [
        "h",
        "Preview privacy"
      ],
      [
        "small",
        "Protect previews containing confidential or unfinished material. Preview protection does not automatically protect production. Confirm production access separately if the site includes private content. See reference 6."
      ]
    ]
  },
  {
    "id": "guide-5",
    "title": "Maintenance and client handoff",
    "blocks": [
      [
        "p",
        "Define the ongoing service arrangement before launch so ownership, maintenance and future changes remain clear."
      ],
      [
        "c",
        "Agree who handles content edits, technical updates and urgent incidents."
      ],
      [
        "c",
        "Specify maintenance fees, included work, revision limits and response expectations."
      ],
      [
        "c",
        "Record who pays subscriptions and approves upgrades or additional usage."
      ],
      [
        "c",
        "Document repository, hosting, domain, integration and billing locations."
      ],
      [
        "c",
        "Record environment-variable names and purposes. Keep secret values and recovery codes in a client-controlled password manager."
      ],
      [
        "c",
        "Document deployment, rollback and recovery procedures."
      ],
      [
        "c",
        "Back up databases, uploads and CMS content where applicable. Git history does not back up these systems automatically."
      ],
      [
        "c",
        "Confirm the client can invite a replacement developer without your involvement."
      ],
      [
        "c",
        "At the end of the engagement, remove developer access and revoke or rotate credentials issued for that work."
      ],
      [
        "h",
        "Suggested client agreement description"
      ],
      [
        "p",
        "Your website source code and hosting will be held in accounts your business controls. Retro Forge Studios will receive invited access to build, launch and maintain the site. You retain account recovery, billing control and the ability to appoint another developer. Ownership and licensing of delivered work will be defined in our project agreement."
      ],
      [
        "h",
        "Before development begins"
      ],
      [
        "p",
        "Convert discovery answers into an approved brief: goal, audience, sitemap, features, visual direction, content responsibilities, integrations, budget, timeline, revision allowance and launch acceptance criteria."
      ],
      [
        "small",
        "Approval contact  ___________________________________________<br/>Content owner  ______________________________________________<br/>Maintenance contact  ________________________________________<br/>Approved launch date  _______________________________________"
      ]
    ]
  }
] as const;
export const questionGroups = [
  {
    "title": "Business fit scope and budget",
    "questions": [
      {
        "id": "q1",
        "number": 1,
        "label": "What does your business offer, and who is your ideal customer?"
      },
      {
        "id": "q2",
        "number": 2,
        "label": "Why are you building or replacing the website now?"
      },
      {
        "id": "q3",
        "number": 3,
        "label": "What is the most important action visitors should take?"
      },
      {
        "id": "q4",
        "number": 4,
        "label": "What would make this project successful after three to six months?"
      },
      {
        "id": "q5",
        "number": 5,
        "label": "What budget is allocated for the build and ongoing services?"
      },
      {
        "id": "q6",
        "number": 6,
        "label": "Is there a required launch date, and what drives it?"
      },
      {
        "id": "q7",
        "number": 7,
        "label": "Who makes the final decision, and who else reviews the work?"
      }
    ]
  },
  {
    "title": "Audience and messaging",
    "questions": [
      {
        "id": "q8",
        "number": 8,
        "label": "What problems are visitors trying to solve when they arrive?"
      },
      {
        "id": "q9",
        "number": 9,
        "label": "What makes your business different from competitors?"
      },
      {
        "id": "q10",
        "number": 10,
        "label": "What customer questions or objections should the website address?"
      },
      {
        "id": "q11",
        "number": 11,
        "label": "Which services, products, locations or audiences deserve priority?"
      },
      {
        "id": "q12",
        "number": 12,
        "label": "What proof can we show, such as reviews, case studies or certifications?"
      },
      {
        "id": "q13",
        "number": 13,
        "label": "What tone should the site use, such as professional, warm or technical?"
      }
    ]
  },
  {
    "title": "Visual direction",
    "questions": [
      {
        "id": "q14",
        "number": 14,
        "label": "Do you have an approved logo, color palette, fonts or brand guide?"
      },
      {
        "id": "q15",
        "number": 15,
        "label": "Which three websites do you like, and what works about each?"
      },
      {
        "id": "q16",
        "number": 16,
        "label": "Which websites do you dislike, and what should we avoid?"
      },
      {
        "id": "q17",
        "number": 17,
        "label": "Should the site feel bold, minimal, traditional, warm or luxurious?"
      },
      {
        "id": "q18",
        "number": 18,
        "label": "Do you have photos or video, or need a shoot or licensed imagery?"
      },
      {
        "id": "q19",
        "number": 19,
        "label": "Which design elements or brand rules must be included?"
      }
    ]
  },
  {
    "title": "Pages and content",
    "questions": [
      {
        "id": "q20",
        "number": 20,
        "label": "Which pages are required at launch?"
      },
      {
        "id": "q21",
        "number": 21,
        "label": "Who will write, edit and approve the copy?"
      },
      {
        "id": "q22",
        "number": 22,
        "label": "Is existing content accurate enough to reuse?"
      },
      {
        "id": "q23",
        "number": 23,
        "label": "Do you need a portfolio, case studies, team bios, FAQs, blog or resources?"
      },
      {
        "id": "q24",
        "number": 24,
        "label": "Are multiple languages needed?"
      },
      {
        "id": "q25",
        "number": 25,
        "label": "Who supplies privacy notices, terms and required business information?"
      }
    ]
  },
  {
    "title": "Features and integrations",
    "questions": [
      {
        "id": "q26",
        "number": 26,
        "label": "Do visitors need quotes, appointments, purchases, deposits or accounts?"
      },
      {
        "id": "q27",
        "number": 27,
        "label": "What should forms collect, and where should submissions go?"
      },
      {
        "id": "q28",
        "number": 28,
        "label": "Which CRM, email, booking, payment or other systems must connect?"
      },
      {
        "id": "q29",
        "number": 29,
        "label": "Do you need uploads, searchable listings, memberships or private content?"
      },
      {
        "id": "q30",
        "number": 30,
        "label": "Do you need to edit the site yourself? Which parts, and how often?"
      },
      {
        "id": "q31",
        "number": 31,
        "label": "Which accessibility requirements or customer needs should we address?"
      }
    ]
  },
  {
    "title": "Existing site and launch",
    "questions": [
      {
        "id": "q32",
        "number": 32,
        "label": "Who controls the domain, DNS, hosting and business email today?"
      },
      {
        "id": "q33",
        "number": 33,
        "label": "Which existing pages receive valuable traffic or rank in search?"
      },
      {
        "id": "q34",
        "number": 34,
        "label": "Which locations and search terms matter most?"
      },
      {
        "id": "q35",
        "number": 35,
        "label": "Do you have analytics or Search Console access?"
      },
      {
        "id": "q36",
        "number": 36,
        "label": "What must keep working during the transition?"
      },
      {
        "id": "q37",
        "number": 37,
        "label": "Who maintains the site after launch, and how are changes requested?"
      }
    ]
  }
] as const;
export const projectFields = [
{id:"name",label:"Your name",type:"text",required:true,autocomplete:"name"},
{id:"email",label:"Email address",type:"email",required:true,autocomplete:"email"},
{id:"business",label:"Business name",type:"text",required:true,autocomplete:"organization"},
{id:"website",label:"Current website",type:"url",required:false,autocomplete:"url"},
{id:"target_launch",label:"Target launch date",type:"date",required:false},
{id:"approval_contact",label:"Who approves the project and launch?",type:"text",required:false},
{id:"content_owner",label:"Who supplies and approves content?",type:"text",required:false},
{id:"maintenance_contact",label:"Who will manage the site after launch?",type:"text",required:false},
{id:"approved_launch",label:"Approved launch date if already agreed",type:"date",required:false}
] as const;
export const readinessItems = ["GitHub account and business organization ready","Website repository ready","Retro Forge Studios invited to GitHub","Cloudflare account ready","Retro Forge Studios invited to Cloudflare","Domain registrar access confirmed","Business email and DNS contact identified","Brand assets and content available","Project approval contact identified"] as const;
export const briefFields = [
{id:"agreed_scope",label:"Agreed website scope"},
{id:"client_tasks",label:"Client tasks before kickoff"},
{id:"studio_tasks",label:"Retro Forge Studios tasks before kickoff"},
{id:"open_questions",label:"Open questions and dependencies"}
] as const;
