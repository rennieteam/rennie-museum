module.exports = {
  getTemplate(message){
    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title></title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <style type="text/css">
          * {
            -ms-text-size-adjust:100%;
            -webkit-text-size-adjust:none;
            -webkit-text-resize:100%;
            text-resize:100%;
          }
          a{
            outline:none;
            color:#da291c;
            text-decoration:underline;
          }
          a:hover{text-decoration:none !important;}
          a[x-apple-data-detectors] {
            color:inherit !important;
            text-decoration: none !important;
          }
          .active:hover{opacity:0.8;}
          .active{
            -webkit-transition:all 0.3s ease;
             -moz-transition:all 0.3s ease;
              -ms-transition:all 0.3s ease;
                transition:all 0.3s ease;
          }
          table td{border-collapse:collapse !important; mso-ascii-font-family:Arial, sans-serif;}
          .ExternalClass, .ExternalClass a, .ExternalClass span, .ExternalClass b, .ExternalClass br, .ExternalClass p, .ExternalClass div{line-height:inherit;}
          .tpl-content{padding:0 !important;}
          .cke_show_borders{background:#e4e4e4 !important;}
          .tpl-repeatmovewrap > .tpl-repeatmove{top:-15px !important;}
          @media only screen and (max-width:500px) {
            /* default style */
            table[class="flexible"]{width:100% !important;}
            *[class="hide"]{
              display:none !important;
              width:0 !important;
              height:0 !important;
              padding:0 !important;
              font-size:0 !important;
              line-height:0 !important;
            }
            td[class="img-flex"] img{width:100% !important; height:auto !important;}
            td[class="aligncenter"]{text-align:center !important;}
            th[class="flex"]{display:block !important; width:100% !important;}
            tr[class="table-holder"]{display:table !important; width:100% !important;}
            th[class="thead"]{display:table-header-group !important; width:100% !important;}
            th[class="tfoot"]{display:table-footer-group !important; width:100% !important;}
            /* custom style */
            table[class="alignleft"]{
              margin:0 auto !important;
              float:none !important;
            }
            table[class="flexible"]{padding:15px !important;}
            td[class="frame"]{padding:15px !important;}
            a[class="frame"]{padding:15px !important;}
            /* td { padding-left: 15px !important; padding-right: 15px !important;} */
            td[class="holder"]{padding:15px 15px !important;}
            td[class="logo"]{text-align: left !important;}
            td[class="footer"]{padding-bottom:30px !important; padding-left: 15px !important; padding-right: 15px !important;}
            /* table[class="rule"] {padding-left: 15px !important; padding-right: 15px !important; } */
            td[class="sm-link"]{padding: 0 15px 0 0 !important;}
            td[class="ico-style"]{padding:0 10px !important;}
          }
        </style>
      </head>
      <body style="margin:0; padding:0;" bgcolor="#f5f6f5">
        <table style="min-width:320px;" width="100%" cellspacing="0" cellpadding="0" bgcolor="#f5f6f5">
          <!-- fix for gmail -->
          <tr>
            <td style="line-height:0;"><div style="display:none; white-space:nowrap; font:15px/1px courier;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</div></td>
          </tr>
          <tr>
            <td>
              <table class="flexible" width="600" align="center" style="margin:0 auto;" cellpadding="0" cellspacing="0">
                <!-- fix for gmail -->
                <tr>
                  <td class="hide">
                    <table width="600" cellpadding="0" cellspacing="0" style="width:600px !important;">
                      <tr>
                        <td style="min-width:600px; font-size:0; line-height:0;">&nbsp;</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <!-- header -->
                <tr class="hide">
                  <td class="frame " bgcolor="#f5f6f5" style="padding:30px 15px;"></td>
                </tr>
                <tr>
                  <td class="frame" bgcolor="#ffffff" style="padding:30px 30px 15px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td>
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <th class="flex" width="80" align="left" style="vertical-align:top; padding:0;">
                                <table width="100%" cellpadding="0" cellspacing="0">
                                  <tr>
                                    <td  class="logo" mc:edit="block-01" align="center" style="text-align: left;"><a href="https://rennie.com" target="_blank"><img src="https://s3.ca-central-1.amazonaws.com/rennie-public-assets/museum/rennie_museum_1x.png" height="14" width="127" border="0" style="width:127px; vertical-align:top;" alt="rennie"/></a></td>
                                  </tr>
                                </table>
                              </th>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <!-- main -->
                <tr>
                  <td class="holder" bgcolor="#ffffff" style="padding:0px 30px 30px;">
                    <table  class="rule" width="100%" cellpadding="0" cellspacing="0">
                      <tr style="">
                        <td align="left" valign="top" width="100%" height="1" style="background-color: #E2E2E2; border-collapse:collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; mso-line-height-rule: exactly; line-height: 1px;"><!--[if gte mso 15]>&nbsp;<![endif]--></td>
                      </tr>
                    </table>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td mc:edit="block-11" align="left" style="padding:30px 0 0; font: 20px/25px Georgia, serif; color:#000000;">
                          <div style="margin:0; color:black; font-size:11px; font-family:Georgia, serif">${message}</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <!-- footer -->
                <tr>
                  <td class="footer" bgcolor="#ffffff" style="padding:0 30px 30px;">
                    <table  class="rule" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="left" valign="top" width="100%" height="1" style="background-color: #E2E2E2; border-collapse:collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; mso-line-height-rule: exactly; line-height: 1px;"><!--[if gte mso 15]>&nbsp;<![endif]--></td>
                      </tr>
                    </table>


                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td mc:edit="block-65" align="left" style="padding:15px 0 0; font:12px/15px Georgia, serif; color: #000000;">
                          The Wing Sang Building<br/>
                          51 East Pender Street <br/>
                          Vancouver, BC V6A 1S9 <br/>
                          Canada<br/><br/>
                          <a href="https://renniemuseum.org" style="text-decoration:underline; color:#DA291C;">renniemuseum.org</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>`
  }
}
