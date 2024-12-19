import { AfterViewInit, Component, Renderer2 } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-samsung-wallet-button',
  standalone: true,
  imports: [],
  templateUrl: './samsung-wallet-button.component.html',
  styleUrl: './samsung-wallet-button.component.scss'
})
export class SamsungWalletButtonComponent implements AfterViewInit {
  constructor(private renderer: Renderer2, private auth: AuthService) { }

  // ngAfterViewInit(): void {
  //   this.addSamsungWalletScript();  // Load the Samsung Wallet script
  // }

  // addSamsungWalletScript(): void {
  //   const script = this.renderer.createElement('script');
  //   script.src = 'https://us-cdn-gpp.mcsvc.samsung.com/lib/wallet-card.js';
  //   script.type = 'text/javascript';

  //   script.onload = () => {
  //     // Call samsungWallet.addButton once the script is loaded
  //     this.addWalletButton();
  //   };

  //   this.renderer.appendChild(document.body, script);  // Dynamically add the script to the document
  // }

  // // generateCDATA(): string {
  // //   const secretKey = 'testCard';  // Store this securely, not in the codebase

  // //   // Create the payload for the card data
  // //   const payload = {
  // //     card: {
  // //       card: {
  // //         type: "loyalty",
  // //         subType: "others",
  // //         data: [
  // //           {
  // //             refId: 'b3fdc982-28c9-47a3-b02f-d484779698a8', // Generate a unique refId
  // //             createdAt: Date.now(),
  // //             updatedAt: Date.now(),
  // //             language: "en",
  // //             attributes: {
  // //               title: "Samsung Loyalty Card",
  // //               logoImage: "https://example.com/logo.png",
  // //               providerName: "Samsung Loyalty Card Provider",
  // //               noticeDesc: "<ul><li>Loyalty Card Test</li></ul>",
  // //               balance: "500P"
  // //             }
  // //           }
  // //         ]
  // //       }
  // //     }
  // //   };

  // //   // Sign and encode the payload using JWT
  // //   const token = jwt.sign(payload, secretKey, { algorithm: 'HS256' });

  // //   return token;  // Return the signed JWT token
  // // }



  // addWalletButton(): void {
  //   // const cdata = this.generateCDATA();
  //   const cardId = '3hojq1b8mhh00';
  //   const partnerId = '4098909391640138496';


  //   (window as any).samsungWallet.addButton({
  //     partnerCode: partnerId,
  //     cardId,
  //     cdata: {
  //       card: {
  //         type: "loyalty",
  //         subType: "others",
  //         data: [
  //           {
  //             refId: 'b3fdc982-28c9-47a3-b02f-d484779698a8', // Generate a unique refId
  //             createdAt: Date.now(),
  //             updatedAt: Date.now(),
  //             language: "en",
  //             attributes: {
  //               title: "Samsung Loyalty Card",
  //               logoImage: "https://example.com/logo.png",
  //               providerName: "Samsung Loyalty Card Provider",
  //               noticeDesc: "<ul><li>Loyalty Card Test</li></ul>",
  //               balance: "500P"
  //             }
  //           }
  //         ]
  //       }
  //     },
  //     targetId: 'TARGET_ID',
  //     buttonId: 'BUTTON_ID',
  //     target: 'wallet',
  //     showForced: true,
  //   });


  //}

  ngAfterViewInit(): void {
    this.addSamsungWalletScript();  // Load the Samsung Wallet script
  }

  addSamsungWalletScript(): void {
    const script = this.renderer.createElement('script');
    script.src = 'https://us-cdn-gpp.mcsvc.samsung.com/lib/wallet-card.js';
    script.type = 'text/javascript';

    script.onload = () => {
      // Call samsungWallet.addButton once the script is loaded
      this.addWalletButton();
    };

    this.renderer.appendChild(document.body, script);  // Dynamically add the script to the document
  }

  // Generate the card data object
  generateCDATA() {
    return {
      card: {
        type: "ticket",
        data: [
          {
            refId: "d0075902-7329-4a8e-bb3e-15759cae6417",
            createdAt: 1727845200000,
            updatedAt: 1727845200000,
            language: "ko",
            attributes: {
              title: "Lost Time : Performance",
              category: "Performance",
              eventId: "event-001",
              groupingId: "grouping-002",
              orderId: "order-001",
              bgColor: "#8a2916",
              mainImg: "https://djcpagh05u38x.cloudfront.net/wlt/kr/stg/x1IWgocnRoqA5DmWPykfKQ/6vWQK89PSs6SWRF6hrZU8Q.png",
              subtitle1: "Musical Ticket",
              logoImage: "https://gpp.walletsvc.samsung.com/mcs/images/contents/wallet_intro_logo.png",
              "logoImage.darkUrl": "https://gpp.walletsvc.samsung.com/mcs/images/contents/wallet_intro_logo.png",
              providerName: "Ticket Company",
              seatClass: "VIP",
              entrance: "1",
              seatNumber: "F3",
              seatLayoutImage: "https://us-cdn-gpp.mcsvc.samsung.com/lib/image/ticket_default.png",
              issueDate: 1727845200000,
              reservationNumber: "TICKET-12345",
              user: "김삼성",
              certification: "9.3",
              startDate: 1729816814772,
              endDate: 1730116814772,
              person1: "{\"person\" : [{\"category\" : \"Adult\", \"count\": 1 },{\"category\" : \"Child\", \"count\": 2 }]}",
              locations: "[{\"lat\": 37.2573276, \"lng\": 127.0528215, \"address\": \"경기도 수원시 영통구 삼성로\", \"name\": \"영통 5관\"}]",
              noticeDesc: "{\"count\":2,\"info\":[{\"title\":\"[공연 이용 안내]\",\"content\":[\"1. 마스크 착용\",\"2. 상영관 입장 전 발열 체크\",\"3. 공연 이용 전체 고객 대상 전자출입명부 작성\",\"입장 전 다소 시간이 소요되더라도\",\"고객 여러분의 많은 협조 부탁드립니다.\"]},{\"title\":\"[주차 안내]\",\"content\":[\"주차확인은 매표소에 비치된 주차 PC에서 등록시 입차기준 3시간 무료주차 가능.\",\"두편 연속관람시 추가 세시간 불가 단, 출차후 재입차시 3시간 추가 등록 가능.\"]}]}",
              csInfo: "{\"call\":\"555) 123-4567\", \"email\":\"cs@email.com\", \"website\":\"https://homepage.com/cs\"}",
              appLinkLogo: "https://play-lh.googleusercontent.com/ZnFa1roZ7hpv9j-jIAcBjmjuDl2x-FnuwTE0OYvbbcwvf5VPzOQQiKBXGK7d-APTvag=w240-h480-rw",
              appLinkName: "Ticket",
              appLinkData: "https://www.samsung.com/",
              blinkColor: "#00FFFF",
              "barcode.value": "CS16138353212584806754",
              "barcode.serialType": "QRCODE",
              "barcode.ptFormat": "QRCODESERIAL",
              "barcode.ptSubFormat": "QR_CODE"
            }
          }
        ]
      }
    };
  }

  // Encrypt the card data object using AES
  encryptCDATA(cdata: object): string {
    const secretKey = 'Test';  // Use a secure key here
    const cdataString = JSON.stringify(cdata);  // Convert the JSON object to a string

    // Encrypt the cdata string using AES encryption
    const encryptedCDATA = CryptoJS.AES.encrypt(cdataString, secretKey).toString();

    return encryptedCDATA;  // Return the encrypted string
  }

  // Add the wallet button and pass the encrypted cdata
  addWalletButton(): void {
    // const cdata = this.generateCDATA();
    // const encryptedCDATA = this.encryptCDATA(cdata);  // Encrypt the cdata

    const cardId = '3hp38ubggrbg0';
    const partnerId = '4097184320531138496';

    (window as any).samsungWallet.addButton({
      partnerCode: partnerId,
      cardId: cardId,
      cdata: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjNocDVmMHFsbzVuMDAifQ.eyJwYXJ0bmVySWQiOiI0MDk5NTkzOTkxOTQ3MTM4NDk2IiwiZGF0YSI6eyJjYXJkIjp7InR5cGUiOiJ0aWNrZXQiLCJkYXRhIjpbeyJyZWZJZCI6ImM0ZGY4NDMyLTgwOWEtNGY1ZC05ZjkzLTBjM2U5MjE3MDU2YSIsImNyZWF0ZWRBdCI6MTcyNzg0NTIwMDAwMCwidXBkYXRlZEF0IjoxNzI3ODQ1MjAwMDAwLCJsYW5ndWFnZSI6ImVuIiwiYXR0cmlidXRlcyI6eyJ0aXRsZSI6Ikxvc3QgVGltZSIsImNhdGVnb3J5IjoiTW92aWUiLCJldmVudElkIjoiZXZlbnQtMDAxIiwiZ3JvdXBpbmdJZCI6Imdyb3VwaW5nLTAwMSIsIm9yZGVySWQiOiJvcmRlci0wMDEiLCJtYWluSW1nIjoiaHR0cHM6Ly9kamNwYWdoMDV1Mzh4LmNsb3VkZnJvbnQubmV0L3dsdC9rci9zdGcveDFJV2dvY25Sb3FBNURtV1B5a2ZLUS82dldRSzg5UFNzNlNXUkY2aHJaVThRLnBuZyIsInN1YnRpdGxlMSI6IlRpY2tldCBTdWJ0aXRsZSIsImxvZ29JbWFnZSI6Imh0dHBzOi8vZ3BwLndhbGxldHN2Yy5zYW1zdW5nLmNvbS9tY3MvaW1hZ2VzL2NvbnRlbnRzL3dhbGxldF9pbnRyb19sb2dvLnBuZyIsImxvZ29JbWFnZS5kYXJrVXJsIjoiaHR0cHM6Ly9ncHAud2FsbGV0c3ZjLnNhbXN1bmcuY29tL21jcy9pbWFnZXMvY29udGVudHMvd2FsbGV0X2ludHJvX2xvZ28ucG5nIiwicHJvdmlkZXJOYW1lIjoiVGlja2V0IENvbXBhbnkiLCJzZWF0Q2xhc3MiOiI0RFgiLCJlbnRyYW5jZSI6IjEiLCJzZWF0TnVtYmVyIjoiR-yXtCA5Iiwic2VhdExheW91dEltYWdlIjoiaHR0cHM6Ly91cy1jZG4tZ3BwLm1jc3ZjLnNhbXN1bmcuY29tL2xpYi9pbWFnZS90aWNrZXRfZGVmYXVsdC5wbmciLCJpc3N1ZURhdGUiOjE3Mjc4NDUyMDAwMDAsInJlc2VydmF0aW9uTnVtYmVyIjoiVElDS0VULTEyMzQ1IiwidXNlciI6IktpbSBTYW1zdW5nIiwiY2VydGlmaWNhdGlvbiI6IjkuMyIsInN0YXJ0RGF0ZSI6MTcyOTg5ODA1NjY3NiwiZW5kRGF0ZSI6MTczMDE5ODA1NjY3NiwicGVyc29uMSI6IntcInBlcnNvblwiIDogW3tcImNhdGVnb3J5XCIgOiBcIkFkdWx0XCIsIFwiY291bnRcIjogMSB9LHtcImNhdGVnb3J5XCIgOiBcIkNoaWxkXCIsIFwiY291bnRcIjogMiB9XX0iLCJsb2NhdGlvbnMiOiJbe1wibGF0XCI6IDM3LjI1NzMyNzYsIFwibG5nXCI6IDEyNy4wNTI4MjE1LCBcImFkZHJlc3NcIjogXCLqsr3quLDrj4Qg7IiY7JuQ7IucIOyYge2Gteq1rCDsgrzshLHroZxcIiwgXCJuYW1lXCI6IFwi7JiB7Ya1IDXqtIBcIn1dIiwibm90aWNlRGVzYyI6IntcImNvdW50XCI6MixcImluZm9cIjpbe1widGl0bGVcIjpcIlvqt7nsnqUg7J207JqpIOyViOuCtF1cIixcImNvbnRlbnRcIjpbXCIxLiDrp4jsiqTtgawg7LCp7JqpXCIsXCIyLiDsg4HsmIHqtIAg7J6F7J6lIOyghCDrsJzsl7Qg7LK07YGsXCIsXCIzLiDqt7nsnqUg7J207JqpIOyghOyytCDqs6DqsJ0g64yA7IOBIOyghOyekOy2nOyeheuqheu2gCDsnpHshLFcIixcIuyeheyepSDsoIQg64uk7IaMIOyLnOqwhOydtCDshozsmpTrkJjrjZTrnbzrj4RcIixcIuqzoOqwnSDsl6zrn6zrtoTsnZgg66eO7J2AIO2YkeyhsCDrtoDtg4Hrk5zrpr3ri4jri6QuXCJdfSx7XCJ0aXRsZVwiOlwiW-yjvOywqCDslYjrgrRdXCIsXCJjb250ZW50XCI6W1wi7KO87LCo7ZmV7J247J2AIOunpO2RnOyGjOyXkCDruYTsuZjrkJwg7KO87LCoIFBD7JeQ7IScIOuTseuhneyLnCDsnoXssKjquLDspIAgM-yLnOqwhCDrrLTro4zso7zssKgg6rCA64qlLlwiLFwi65GQ7Y64IOyXsOyGjeq0gOuejOyLnCDstpTqsIAg7IS47Iuc6rCEIOu2iOqwgCDri6gsIOy2nOywqO2bhCDsnqzsnoXssKjsi5wgM-yLnOqwhCDstpTqsIAg65Ox66GdIOqwgOuKpS5cIl19XX0iLCJjc0luZm8iOiJ7XCJjYWxsXCI6XCI1NTUpIDEyMy00NTY3XCIsIFwiZW1haWxcIjpcImNzQGVtYWlsLmNvbVwiLCBcIndlYnNpdGVcIjpcImh0dHBzOi8vaG9tZXBhZ2UuY29tL2NzXCJ9IiwiYXBwTGlua0xvZ28iOiJodHRwczovL3BsYXktbGguZ29vZ2xldXNlcmNvbnRlbnQuY29tL1puRmExcm9aN2hwdjlqLWpJQWNCam1qdURsMngtRm51d1RFME9ZdmJiY3d2ZjVWUHpPUVFpS0JYR0s3ZC1BUFR2YWc9dzI0MC1oNDgwLXJ3IiwiYXBwTGlua05hbWUiOiJUaWNrZXQiLCJhcHBMaW5rRGF0YSI6Imh0dHBzOi8vd3d3LnNhbXN1bmcuY29tLyIsImJnQ29sb3IiOiIjMzUxRjY2IiwiYmxpbmtDb2xvciI6IiMwMEZGRkYiLCJiYXJjb2RlLnZhbHVlIjoiQ1MxNjEzODM1MzIxMjU4NDgwNjc1NCIsImJhcmNvZGUuc2VyaWFsVHlwZSI6IlFSQ09ERSIsImJhcmNvZGUucHRGb3JtYXQiOiJRUkNPREVTRVJJQUwiLCJiYXJjb2RlLnB0U3ViRm9ybWF0IjoiUVJfQ09ERSJ9fV19fSwiaWF0IjoxNzI5NjAxOTM1LCJleHAiOjE3Mjk2MDU1MzV9.lLqW4uvBmqbP6R5nDXhHg8aQAgGv_rLDYkVW4LR7woSxcWLKf9z0NiCkX7H3OKWga1w1vNUUout7YniDoW_NilTfZE-SWTuprJBweC6XG0g5Ci2X3wdX08yCwYkmBuzq8F_VLEWpB0NYsJwrl-Xkk3MmtdLxIjcTTD9xpbbSpn8jj_ip2WRHC07PhdB4jd9nsXwmHQn5VpFSKEsFX9fb1PGzT1iaG_U_6I1PfJA3-I_F_pes0Ol_Wb0Ii6r8Cio_8wk7mH4FPfvAGgZ-8gHdVcFUXyjlAVyKc3FjeRCxFmdq3Vo3PX5NaG387eHMM9A9ouk2oIQ9FFrKAAcXg_M_jw",
      targetId: 'TARGET_ID',
      buttonId: 'BUTTON_ID',
      target: 'wallet',
      showForced: true,
    });
  }


}
