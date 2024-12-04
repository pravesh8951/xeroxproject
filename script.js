window.onload = function() {
  let canvas = document.getElementById('qr-code');
  QRCode.toCanvas(canvas, 'https://yourserver.com/upload', function (error) {
      if (error) console.error(error);
      console.log('QR code generated!');
  });

  document.getElementById('uploadBtn').addEventListener('click', function() {
      const fileInput = document.getElementById('fileInput');
      const file = fileInput.files[0];

      if (file) {
          const fileReader = new FileReader();
          fileReader.onload = function(event) {
              const typedarray = new Uint8Array(event.target.result);

              pdfjsLib.getDocument(typedarray).promise.then(function(pdf) {
                  const pageCount = pdf.numPages;
                  document.getElementById('pageCount').textContent = pageCount;

                  const costPerPage = 1.5; // Example cost per page
                  const totalCost = pageCount * costPerPage;
                  document.getElementById('totalCost').textContent = totalCost.toFixed(2);
              });
          };
          fileReader.readAsArrayBuffer(file);
      }
  });

  document.getElementById('payBtn').addEventListener('click', function() {
      const totalCost = parseFloat(document.getElementById('totalCost').textContent) * 100; // Convert to paise

      var options = {
          "key": "PTBE569KHGJGwi", // Replace with your Razorpay key ID
          "amount": totalCost, // Amount in paise
          "currency": "INR",
          "name": "PDF Page Counter",
          "description": "Payment for PDF page count",
          "handler": function (response){
              alert("Payment successful. Payment ID: " + response.razorpay_payment_id);
          },
          "prefill": {
              "name": "Your Name",
              "email": "you@example.com"
          },
          "theme": {
              "color": "#3399cc"
          }
      };
      var rzp1 = new Razorpay(options);
      rzp1.open();
  });
};
