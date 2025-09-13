import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { NAVIGATION } from 'constant/config'

import Button from 'components/Button'
import Reference from "components/Reference";
import { getDate } from "helpers/getDate";

import style from './index.module.scss'

const List = ({ onEdit, onDelete }) => {
  const { t } = useTranslation()

  const [promos, setPromos] = useState([
    {
      "id": 1,
      "title": "BONUS SPORT DE BUN VENIT",
      "description": "100% până la 500 de lei, bonus cu rulaj 1x! E cea mai bună ofertă din România!",
      "link": "/wiki/bonus-de-bun-venit-sport-500-lei-2025",
      "linkText": "Detalii",
      "badges": [
        "Online"
      ],
      "image": "https://superbet-content.freetls.fastly.net/assets/97b4e39f-a4c7-4e46-b51e-52bb4fd0e12c?key=promotions-page",
      "startDateMs": 1744873320000
    },
    {
      "id": 2,
      "title": "BONUS CASINO DE BUN VENIT",
      "description": "100% până la 500 de lei, bonus cu rulaj 1x! E cea mai bună ofertă din România!",
      "link": "/wiki/bonus-de-bun-venit-casino-500-lei-2025",
      "linkText": "Detalii",
      "badges": [
        "Online"
      ],
      "image": "https://superbet-content.freetls.fastly.net/assets/06babc96-ace1-45fa-a116-2b286ed28c17?key=promotions-page",
      "startDateMs": 1744873320000
    },
    {
      "id": 3,
      "title": "Champions Clash",
      "description": "Premii zilnice în turneul campionilor! 2,5 milioane de lei în total! ",
      "link": "/wiki/champions-clash-termene-conditii-11092025",
      "linkText": "Detalii",
      "badges": [
        "Online"
      ],
      "image": "https://superbet-content.freetls.fastly.net/assets/1ccbafb7-a57a-41bc-9f16-1888366d0797?key=promotions-page",
      "startDateMs": 1744873320000
    },
    {
      "id": 4,
      "title": "SUPERLIGA 25+26",
      "description": "Ai 26 lei Pariu Gratuit în fiecare etapă de SuperLiga, pentru primul bilet necâștigător!",
      "link": "/wiki/superliga-25-26-pariu-gratuit",
      "linkText": "Detalii",
      "badges": [
        "Online"
      ],
      "image": "https://superbet-content.freetls.fastly.net/assets/4a6c8512-fe24-4628-a3b0-50d0c7234c0c?key=promotions-page",
      "startDateMs": 1744873320000
    },
    {
      "id": 5,
      "title": "Premii Misterioase Wazdan",
      "description": "Multiplicator surpriză până la 100x miza, doar la jocurile Wazdan! 300.000 de lei premii totale!",
      "link": "/wiki/mystery-multiplier-drop-082025",
      "linkText": "Detalii",
      "badges": [
        "Online"
      ],
      "image": "https://superbet-content.freetls.fastly.net/assets/033810db-5a0e-446c-8cf6-cc8090fdb06b?key=promotions-page",
      "startDateMs": 1744873320000
    },
    {
      "id": 6,
      "title": "HOT STREAK ",
      "description": "Premii totale de 1.000.000 lei pe lună",
      "link": "https://superbet.onelink.me/8IRb/wzqhkz4o",
      "linkText": "Joacă acum!",
      "badges": [
        "Online"
      ],
      "image": "https://superbet-content.freetls.fastly.net/assets/8f357092-2b64-44d0-9db3-64ffd92ccd0a?key=promotions-page",
      "startDateMs": 1744873320000
    },
    {
      "id": 7,
      "title": "Drops & Wins Pragmatic",
      "description": "Premii și turnee zilnice! 30 de milioane de lei!",
      "link": "/wiki/drop-wins-pragmatic-062025",
      "linkText": "Detalii",
      "badges": [
        "Online"
      ],
      "image": "https://superbet-content.freetls.fastly.net/assets/68ccfa29-78da-40a0-b937-1a7d96fd55bf?key=promotions-page",
      "startDateMs": 1744873320000
    },
    {
      "id": 8,
      "title": "Premii Non Stop Drop",
      "description": "Peste 23 de milioane de lei la jocurile Playson selectate!",
      "link": "/wiki/non-stop-drop-playson-072025",
      "linkText": "Detalii",
      "badges": [
        "Online"
      ],
      "image": "https://superbet-content.freetls.fastly.net/assets/1b0bbcf9-740b-4eaf-9561-92fa7ec9bdae?key=promotions-page",
      "startDateMs": 1744873320000
    },
    {
      "id": 9,
      "title": "SUPERBONUS",
      "description": "Acum de la 3 evenimente pe bilet, toate sporturile, pre-meci și live, câștig mai mare!",
      "link": "https://lp.superbet.ro/lp/noulsuperbonus",
      "linkText": "Detalii",
      "badges": [
        "Online",
        "Agenții"
      ],
      "image": "https://superbet-content.freetls.fastly.net/assets/6dc24bb9-20c0-4733-aa75-e287cc9758eb?key=promotions-page",
      "startDateMs": 1744873320000
    },
    {
      "id": 10,
      "title": "Bet Builder",
      "description": "Combini mai multe selecții din același meci într-un singur pariu si obții o cotă mai mare!",
      "link": "https://lp.superbet.ro/lp/betbuilder-retail",
      "linkText": "Detalii",
      "badges": [
        "Agenții"
      ],
      "image": "https://superbet-content.freetls.fastly.net/assets/50472a11-ac3c-4ee4-b084-57903533e78c?key=promotions-page",
      "startDateMs": 1744873320000
    },
    {
      "id": 11,
      "title": "ASIGURARE LA SCHIMBARE",
      "description": "Dacă jucătorul pe care ai pariat este schimbat înainte de startul reprizei a doua, primesti cotă 1!",
      "link": "/wiki/asigurare-la-schimbare",
      "linkText": "Detalii",
      "badges": [
        "Online",
        "Agenții"
      ],
      "image": "https://superbet-content.freetls.fastly.net/assets/5a2d2828-a0ba-4ed9-aca4-0650a7798cdd?key=promotions-page",
      "startDateMs": 1744873320000
    },
    {
      "id": 12,
      "title": "SUPERSPIN",
      "description": "Ești jucător online Superbet, poți câștiga zilnic și la SuperSpin! Învârte roata SuperNorocului!",
      "link": "/superspin",
      "linkText": "JOACĂ ACUM!",
      "badges": [
        "Online"
      ],
      "image": "https://superbet-content.freetls.fastly.net/assets/02502818-c4fd-4476-b349-0eee8653bfd3?key=promotions-page",
      "startDateMs": 1744873320000
    },
    {
      "id": 13,
      "title": "NOU: 4 niveluri de Jackpot",
      "description": "Intră în Superbet Club, plasează un bilet la terminal și... Jackpot!",
      "link": "https://superbet.ro/lp/jackpotsuperbetclub",
      "linkText": "Detalii",
      "badges": [
        "agenții"
      ],
      "image": "https://superbet-content.freetls.fastly.net/assets/b8ff1672-0740-4193-bf78-8c9a1dcd6ba9?key=promotions-page",
      "startDateMs": 1744873320000
    },
    {
      "id": 14,
      "title": "Shining Wheel",
      "description": "Joc nou în agenții! Multiplicator până la x50!",
      "link": "/wiki/shining-wheel-2025",
      "linkText": "Detalii",
      "badges": [
        "Agenții"
      ],
      "image": "https://superbet-content.freetls.fastly.net/assets/5c620d8b-8315-4744-97b8-f6c48301425b?key=promotions-page",
      "startDateMs": 1744873320000
    },
    {
      "id": 15,
      "title": "Diamond X",
      "description": "Joc nou în agenții! Multiplicator până la x10.000!",
      "link": "/wiki/diamond-x-agentii-2025",
      "linkText": "Detalii",
      "badges": [
        "Agenții"
      ],
      "image": "https://superbet-content.freetls.fastly.net/assets/952f9dd7-9692-4122-a966-234d9fff58d7?key=promotions-page",
      "startDateMs": 1744873320000
    },
    {
      "id": 16,
      "title": "Bonus sport în aplicație",
      "description": "20 lei Pariu Gratuit",
      "link": "/wiki/pariu-gratuit-20-lei-170924",
      "linkText": "Detalii",
      "badges": [
        "Online"
      ],
      "image": "https://superbet-content.freetls.fastly.net/assets/834d15f4-03e0-48a6-b627-68a489b2982a?key=promotions-page",
      "startDateMs": 1744873320000
    },
    {
      "id": 17,
      "title": "Bonus casino în aplicație",
      "description": "50 de Rotiri Gratuite la Sweet Bonanza 1000",
      "link": "/wiki/rotiri-gratuite-sweet-bonanza-1000-170924",
      "linkText": "Detalii",
      "badges": [
        "Online"
      ],
      "image": "https://superbet-content.freetls.fastly.net/assets/11f955eb-80a1-48a3-9322-9492516195e9?key=promotions-page",
      "startDateMs": 1744873320000
    },
    {
      "id": 18,
      "title": "SUPERAVANTAJ",
      "description": "La fotbal, tenis, baschet și handbal!",
      "link": "/wiki/superavantaj",
      "linkText": "Detalii",
      "badges": [
        "Online"
      ],
      "image": "https://superbet-content.freetls.fastly.net/assets/dc3388ee-4ef1-4fb6-bcb5-c08c6ef3b7b4",
      "startDateMs": 1744873320000
    },
    {
      "id": 19,
      "title": "Terminalul de pariuri",
      "description": "Ofertă completă pentru pariuri Sportive, Live, Loto, Lucky Six și Câini.",
      "link": "/wiki/terminalul-de-pariuri",
      "linkText": "Detalii",
      "badges": [
        "Agenții"
      ],
      "image": "https://superbet-content.freetls.fastly.net/assets/d3356483-a5bc-448b-a87c-a3482a5fcec5?key=promotions-page",
      "startDateMs": 1744873320000
    },
    {
      "id": 20,
      "title": "SUPER COTA",
      "description": "Cele mai bune cote ale zilei",
      "link": "/wiki/super-cota",
      "linkText": "Detalii",
      "badges": [
        "Online",
        "Agenții"
      ],
      "image": "https://superbet-content.freetls.fastly.net/assets/58f2f75e-32e4-49d7-b7dc-8a3c9b778ce6?key=promotions-page",
      "startDateMs": 1744873320000
    },
    {
      "id": 21,
      "title": "Cote mărite",
      "description": "Cote mărite la cele mai importante evenimente ale zilei",
      "link": "/wiki/cote-marite",
      "linkText": "Detalii",
      "badges": [
        "Online",
        "Agenții"
      ],
      "image": "https://superbet-content.freetls.fastly.net/assets/28831ff4-9a5d-44bb-b782-435a7000567c?key=promotions-page",
      "startDateMs": 1744873320000
    },
    {
      "id": 22,
      "title": "Pariul Șansă Progresiv",
      "description": "Ai pierdut un meci, biletul rămâne câștigător! ",
      "link": "/wiki/pariul-sansa-progresiv",
      "linkText": "Detalii",
      "badges": [
        "Agenții"
      ],
      "image": "https://superbet-content.freetls.fastly.net/assets/28e2c8e3-9da0-47b0-b7ec-9955a91bd77e?key=promotions-page",
      "startDateMs": 1744873320000
    }
  ])

  return (
    <div className={style.block}>
      <div className={style.list}>
        <div className={style.item}>
          <div>
            {t('id')}
          </div>
          <div>
            {t('image')}
          </div>
          <div>
            {t('title')}
          </div>
          <div>
            {t('description')}
          </div>
          <div>
            {t('label')}
          </div>
          <div>
            {t('start_date')}
          </div>
        </div>
        {promos.map(p => (
          <div key={p.id} className={style.item}>
            <div>
              {p.id}
            </div>
            <div>
              {p.image && <img src={p.image} alt={p.title} width={60}/>}
            </div>
            <div>
              {p.title}
            </div>
            <div>
              {p.description}
            </div>
            <div>
              {p.badges[0]} <br /> {p.badges[1]}
            </div>
            <div>
              {getDate(p.startDateMs)}
            </div>
            <div className={style.actions}>
              <Reference
                to={`${NAVIGATION.managements.promos.link}/${p.id}}`}
                classes={['outline']}
                placeholder={t('edit')}
              />
              <Button
                classes={['secondary']}
                placeholder={t('delete')}
                onClick={() => alert('DELETE')}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default List;
