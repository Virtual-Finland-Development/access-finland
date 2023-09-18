import { Text } from 'suomifi-ui-components';
import CustomHeading from '@/components/ui/custom-heading';
import Page from '@shared/components/layout/page';
import CustomLink from '@shared/components/ui/custom-link';

export default function TermsOfUsagePage() {
  return (
    <Page title="Terms of Use">
      <Page.Block className="bg-white">
        <article className="flex flex-col gap-6">
          <CustomHeading variant="h2">Käyttöehdot</CustomHeading>
          <Text className="italic !font-bold">
            Access Finland Käyttöehdot v1.0, 18.09.2023
          </Text>

          <Text>
            Ulkoministeriön (jäljempänä &quot;Palveluntarjoaja&quot;) tuottaman
            Access Finland palvelun (jäljempänä “Palvelu”) käyttämiseen
            sovelletaan näitä käyttöehtoja (jäljempänä “Käyttöehdot“). Palvelun
            käyttäjä (jäljempänä &quot;Käyttäjä&quot;) vakuuttaa tutustuneensa
            näihin käyttöehtoihin ja sitoutuu noudattamaan niitä käyttäessään
            Palvelua.
          </Text>
          <Text>
            Palvelun kirjautumista vaativan osan käyttö edellyttää Käyttäjän
            rekisteröitymistä. Rekisteröityessään Palveluun Käyttäjästä tulee
            Palveluntarjoajan asiakas ja Käyttäjän tiedot rekisteröidään Access
            to Finland -palvelun asiakasrekisteriin.
          </Text>

          <CustomHeading variant="h3">Palvelun kuvaus</CustomHeading>
          <Text>
            Palvelu tarkoittaa näissä Käyttöehdoissa Access to Finland
            verkkopalvelua, joka on maahantulijoille tarkoitettu työpaikkahakuun
            liittyvää tietosisältöä keräävä ja jakava palvelu. Access to
            Finaland verkkopalvelu on on julkisesti rahoitettu digitaalinen
            palvelu, jonka tarkoituksena on helpottaa maahantulijan elämää
            keräämällä työnhakuun liittyvää tietoa uudelleenkäytettäväksi eri
            työnhakupalveluissa jotka on liitetty Access to Finland
            verkkopalveluun.
          </Text>
          <Text>
            Palveluntarjoaja pyrkii tuottamaan mahdollisimman korkeatasoista
            Palvelua sekä vastaa siitä, että Palvelun sisältö on lainmukaista ja
            hyvän tavan mukaista.
          </Text>
          <Text>
            Kaikki oikeudet (omistusoikeus, tekijänoikeus ja muut
            immateriaalioikeudet) Palveluun ovat Palveluntarjoajalla. Käyttäjä
            saa oikeuden käyttää Palvelua näiden käyttöehtojen mukaisesti, mutta
            Käyttäjä ei saa Palveluun liittyviä oikeuksia.
          </Text>
          <Text>
            Käyttäjän käyttöoikeuden sisältö määritellään tässä
            käyttöehtodokumentissa, joka Käyttäjän on hyväksyttävä itseään
            sitovaksi rekisteröityessään Palveluun
          </Text>

          <CustomHeading variant="h3">
            Tietojen kerääminen ja käyttö
          </CustomHeading>
          <CustomHeading variant="h4">
            Henkilön perustiedot{' '}
            <CustomLink
              $bold
              isExternal
              disableVisited
              href="https://definitions.staging.datafinland.dev/definitions/Person/BasicInformation_v0.1"
            >
              Data Definitions Viewer (datafinland.dev)
            </CustomLink>
          </CustomHeading>
          <Text>
            Henkilön perustietoja joiden avulla luodaan tili Access to Finland
            palveluun ja yhdessä työnhakutietiojen kanssa voidaan käyttää
            tylpaikkojen kohdennettuun hakuun.
          </Text>
          <CustomHeading variant="h4">
            Henkilön työnhakutiedot{' '}
            <CustomLink
              $bold
              isExternal
              disableVisited
              href="https://definitions.staging.datafinland.dev/definitions/Person/JobApplicantProfile_v0.1"
            >
              Data Definitions Viewer (datafinland.dev)
            </CustomLink>
          </CustomHeading>
          <Text>
            Tietojen perusteella käyttäjälle voidaan kohdentaa sopivia
            työpaikkailmoituksia.
          </Text>

          <CustomHeading variant="h3">
            Tietojen säilytys ja suojaus
          </CustomHeading>
          <Text>Tieto talletetaan EU alueen sisälle kryptattuna.</Text>

          <CustomHeading variant="h3">
            Kolmansien osapuolten kanssa jaettavat tiedot
          </CustomHeading>
          <Text>
            Profiilin tietoja jaetaan Kehan kanssa työpaikkojen
            suosittelemiseksi.
          </Text>

          <CustomHeading variant="h3">Evästeet ja seuranta</CustomHeading>
          <Text>
            Seurantaevästeitä ei käytetä. Access to Finland voi käyttää palvelun
            sisäisesti evästeitä, Sinuna tunnistautuminen asettaa palvelun
            käyttämiseksi oman sessioevästeen.
          </Text>

          <CustomHeading variant="h3">
            Käyttäjän vastuut ja oikeudet
          </CustomHeading>
          <Text>
            Kirjautuneen käyttäjän palvelun käytön edellytyksenä on
            Käyttöehtojen hyväksyminen Käyttäjää sitovaksi. Hyväksyttyään
            käyttöehdot Käyttäjä sitoutuu:
          </Text>
          <ul className="list-outside list-disc ms-8">
            <li>
              <Text>
                noudattamaan tunnisteet antaneen tahon kanssa tekemiään
                sopimuksia ja tunnisteiden käyttöön liittyviä ehtoja (palvelua
                voi käyttää vain omilla henkilökohtaisilla tunnisteilla),
              </Text>
            </li>
            <li>
              <Text>
                vastaamaan siitä, että hänen palveluun toimittamansa tiedot ovat
                totuudenmukaisia ja palvelun käyttötarkoitusta vastaavia ja että
                hän ei palvelua käyttäessään aiheuta häiriötä muille käyttäjille
                eikä loukkaa muiden käyttäjien eikä Palveluntarjoajan oikeuksia,
              </Text>
            </li>
            <li>
              <Text>
                vastaamaan henkilöllisyytensä paljastumisesta tilanteessa, jossa
                Käyttäjä liittää Palveluun linkkejä esimerkiksi ulkopuolisiin
                palveluihin ja
              </Text>
            </li>
            <li>
              <Text>
                vastaamaan kaikista hänelle Palvelun käytöstä aiheutuvista
                omista käyttökustannuksista (esimerkiksi Internet-verkon
                käyttömaksut, mahdolliset puhelumaksut).
              </Text>
            </li>
          </ul>
          <Text>
            Henkilötietoihin liittyvät oikeudet on kuvattu
            Palvelun Tietosuojaselosteessa.
          </Text>
          <CustomLink href="#">
            Access Finland tietosuojaseloste (TBD)
          </CustomLink>

          <CustomHeading variant="h3">Muutokset käyttöehtoihin</CustomHeading>
          <Text>
            Päivitetyt käyttöehdot hyväksytetään käyttäjällä kirjautuessa.
            Käyttäjän on mahdollista kietäytyä ja poistaa tili.
          </Text>

          <CustomHeading variant="h3">Oikeudellinen viitekehys</CustomHeading>
          <Text>
            Näihin Käyttöehtoihin ja näiden käyttöehtojen tarkoittamiin
            Palveluihin sekä Palvelusta mahdollisesti tehtyyn sopimukseen
            sovelletaan Suomen lakia.
          </Text>

          <CustomHeading variant="h3">Hyväksyntäprosessi</CustomHeading>
          <Text>
            Käyttäjien on hyväksyttävä käyttöehdot palveluun kirjautuessaan. Jos
            käyttöehtoja päivitetään, käyttäjä joutuu hyväksymään päivitetyt
            käyttöehdot kirjautumisen yhteydessä.
          </Text>

          <div className="flex flex-col gap-4">
            <CustomHeading variant="h3">Yhteystiedot</CustomHeading>
            <Text>
              Hankkeen/tietosuojavaltuutettu sähköposti{' '}
              <a
                href="mailto:virtualfinland.um@gov.fi"
                className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
              >
                virtualfinland.um@gov.fi
              </a>
            </Text>
          </div>
        </article>
      </Page.Block>
    </Page>
  );
}
