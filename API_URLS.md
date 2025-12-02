# 🔗 API URL Reference

Setelah deploy, catat URL-URL penting berikut:

## 📍 Local Development

```
Base URL: http://localhost:3000

API Documentation: http://localhost:3000/docs
Swagger JSON: http://localhost:3000/api/docs/swagger.json
```

---

## 🌐 Production (Vercel)

Setelah deploy ke Vercel, Anda akan mendapat URL seperti:

```
Base URL: https://electricity-bills-api.vercel.app

API Documentation: https://electricity-bills-api.vercel.app/docs
Swagger JSON: https://electricity-bills-api.vercel.app/api/docs/swagger.json
```

### Cara Share ke Orang Lain:

**1. Share Link Langsung:**
```
Hey! Check our API documentation:
https://electricity-bills-api.vercel.app/docs
```

**2. QR Code:**
- Generate QR dari URL di https://www.qr-code-generator.com/
- Print atau share image QR code

**3. Embed di Website:**
```html
<iframe 
  src="https://electricity-bills-api.vercel.app/docs" 
  width="100%" 
  height="800px"
  frameborder="0">
</iframe>
```

**4. Markdown (untuk GitHub/Docs):**
```markdown
## API Documentation

📚 [View Swagger UI](https://electricity-bills-api.vercel.app/docs)
📄 [Download OpenAPI JSON](https://electricity-bills-api.vercel.app/api/docs/swagger.json)
```

---

## 🎯 Custom Domain

Jika menggunakan custom domain:

```
Base URL: https://api.yourdomain.com

API Documentation: https://api.yourdomain.com/docs
Swagger JSON: https://api.yourdomain.com/api/docs/swagger.json
```

**Setup Custom Domain di Vercel:**
1. Dashboard → Settings → Domains
2. Add domain: `api.yourdomain.com`
3. Update DNS CNAME:
   ```
   Type: CNAME
   Name: api
   Value: cname.vercel-dns.com
   ```

---

## 📱 Mobile Access

API documentation **responsive** dan bisa diakses dari mobile:
- iPhone/iPad: Safari atau Chrome
- Android: Chrome atau Firefox
- Tablet: Any modern browser

Langsung buka URL docs di mobile browser!

---

## 🔒 Access Control

### Public Endpoints (No Auth):
- `GET /api/panel` - List panels
- `GET /api/panel/{id}` - Get panel by ID
- `GET /api/electricity-bills/{id}` - Get bill by ID
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register

### Protected Endpoints (Requires Auth):
- `POST /api/panel` - Create panel
- `PUT /api/panel/{id}` - Update panel
- `DELETE /api/panel/{id}` - Delete panel
- `GET /api/electricity-bills` - List bills (Facility Management only)
- `POST /api/electricity-bills` - Create bill (Facility Management only)
- `PUT /api/electricity-bills/{id}` - Update bill
- `DELETE /api/electricity-bills/{id}` - Delete bill

### Testing Credentials:
```
Username: Facility management
Password: 1234
Role: Facility management (full access)
```

---

## 📧 Email Template untuk Share

```
Subject: Electricity Bills API - Documentation Available

Hi Team,

Our Electricity Bills API documentation is now live and accessible!

🔗 API Documentation: https://electricity-bills-api.vercel.app/docs
📄 OpenAPI Spec: https://electricity-bills-api.vercel.app/api/docs/swagger.json

Features:
✅ Interactive API testing (Try it out)
✅ Complete endpoint documentation
✅ Request/Response examples
✅ Authentication flow

Testing Credentials:
- Username: Facility management
- Password: 1234

For questions or issues, please contact: [your-email@domain.com]

Best regards,
API Team
```

---

## 🎓 Additional Resources

- **Quick Start**: [DEPLOY_README.md](./DEPLOY_README.md)
- **Complete Guide**: [SWAGGER_API_GUIDE.md](./SWAGGER_API_GUIDE.md)
- **Deployment**: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **Testing Guide**: [QUICK_START_SWAGGER.md](./QUICK_START_SWAGGER.md)

---

## 📊 Analytics & Monitoring

Track API usage dengan:
- **Vercel Analytics**: Dashboard → Analytics
- **Vercel Logs**: Dashboard → Logs → Functions
- **Custom Monitoring**: Setup Sentry/LogRocket

---

## 🆘 Support

Jika ada masalah akses:
1. Check apakah URL benar
2. Clear browser cache
3. Try incognito/private mode
4. Check Vercel deployment status
5. Contact admin

---

**Last Updated**: December 2, 2025
**Version**: 1.0.0
