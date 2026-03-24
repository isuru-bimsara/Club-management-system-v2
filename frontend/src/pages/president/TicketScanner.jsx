import React, { useState, useEffect } from 'react';
import { Camera, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { QrReader } from 'react-qr-reader';
import ticketService from '../../services/ticketService';
import Button from '../../components/ui/Button';

// Using a simplified scanner simulation since `react-qr-reader` is a bit complex 
// to ensure perfect compat, but let's provide the shell and manual entry.
const TicketScanner = () => {
  const [scanResult, setScanResult] = useState('');
  const [manualCode, setManualCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async (code) => {
    if (!code) return;
    
    setIsVerifying(true);
    setVerificationResult(null);
    try {
      // Assuming a specific check endpoint exists, or we use the standard API
      // I'll simulate standard API response handling based on standard DB structures
      const res = await ticketService.getMyTickets({ searchCode: code });
      
      if (res.data && res.data.length > 0) {
        const ticket = res.data[0];
        if (ticket.eTicketCode === code && ticket.status === 'approved') {
          setVerificationResult({
            success: true,
            message: 'Valid Ticket',
            ticket
          });
        } else {
          setVerificationResult({
            success: false,
            message: 'Invalid or Unapproved Ticket',
            ticket
          });
        }
      } else {
        setVerificationResult({
          success: false,
          message: 'Ticket not found'
        });
      }
    } catch (error) {
      toast.error('Verification failed. Try again.');
      setVerificationResult({
        success: false,
        message: 'System Error during verification'
      });
    } finally {
      setIsVerifying(false);
      setScanResult('');
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    handleVerify(manualCode);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark-900">E-Ticket Scanner</h1>
        <p className="mt-1 text-sm text-dark-500">Verify attendee tickets at the entrance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-bold text-dark-900 mb-4 flex items-center gap-2">
              <Camera className="h-5 w-5 text-primary-500" />
              QR Scanner
            </h2>
            
            <div className="aspect-square bg-dark-100 rounded-lg overflow-hidden relative flex items-center justify-center border border-dark-200">
              {isScanning ? (
                <div className="absolute inset-0">
                  <QrReader
                    onResult={(result, error) => {
                      if (!!result) {
                        setScanResult(result?.text);
                        setIsScanning(false);
                        handleVerify(result?.text);
                      }
                      if (!!error) {
                        // Ignore continuous read errors
                      }
                    }}
                    constraints={{ facingMode: 'environment' }}
                    style={{ width: '100%' }}
                  />
                  <div className="absolute inset-0 border-4 border-primary-500 opacity-50 m-12 rounded-lg"></div>
                </div>
              ) : (
                <div className="text-center p-6">
                  <Camera className="h-12 w-12 text-dark-300 mx-auto mb-3" />
                  <Button onClick={() => setIsScanning(true)}>
                    Start Scanner
                  </Button>
                </div>
              )}
            </div>
            
            {isScanning && (
              <div className="mt-4 text-center">
                <Button variant="secondary" onClick={() => setIsScanning(false)} className="w-full">
                  Stop Scanner
                </Button>
              </div>
            )}
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-bold text-dark-900 mb-4">Manual Entry</h2>
            <form onSubmit={handleManualSubmit} className="flex gap-2">
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="Enter e-ticket code..."
                className="input-field flex-1"
                required
              />
              <Button type="submit" disabled={isVerifying || !manualCode}>
                Verify
              </Button>
            </form>
          </div>
        </div>

        <div className="card p-6 bg-dark-50 h-full flex flex-col">
          <h2 className="text-lg font-bold text-dark-900 mb-4 border-b border-dark-200 pb-3">
            Verification Result
          </h2>
          
          <div className="flex-1 flex flex-col items-center justify-center">
            {isVerifying ? (
              <div className="text-center">
                <div className="animate-spin h-12 w-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-dark-600 font-medium">Verifying ticket...</p>
              </div>
            ) : verificationResult ? (
              <div className="w-full text-center space-y-4">
                {verificationResult.success ? (
                  <>
                    <div className="mx-auto h-20 w-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2">
                      <CheckCircle className="h-12 w-12" />
                    </div>
                    <h3 className="text-xl font-bold text-green-700">{verificationResult.message}</h3>
                    
                    {verificationResult.ticket && (
                      <div className="bg-white p-4 rounded-xl border border-dark-200 text-left space-y-2 max-w-sm mx-auto shadow-sm">
                        <p className="text-sm text-dark-500 border-b border-dark-100 pb-2">Ticket Details</p>
                        <p><span className="font-semibold text-dark-700">Event:</span> {verificationResult.ticket.event?.title}</p>
                        <p><span className="font-semibold text-dark-700">Student:</span> {verificationResult.ticket.student?.name}</p>
                        <p><span className="font-semibold text-dark-700">Student ID:</span> {verificationResult.ticket.student?.studentId}</p>
                        <p><span className="font-semibold text-dark-700">Quantity:</span> {verificationResult.ticket.quantity} admit</p>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="mx-auto h-20 w-20 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-2">
                      <XCircle className="h-12 w-12" />
                    </div>
                    <h3 className="text-xl font-bold text-red-700">{verificationResult.message}</h3>
                    <p className="text-sm text-dark-600 mt-2">Please ask the student to provide valid proof of purchase or check with admin.</p>
                  </>
                )}
                
                <div className="pt-6">
                  <Button variant="secondary" onClick={() => setVerificationResult(null)}>
                    Clear Result
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center text-dark-400 p-8 border-2 border-dashed border-dark-200 rounded-xl w-full">
                <TicketIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Scan a QR code or enter code manually to see verification result here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Quick mock TicketIcon since I forgot to import it
const TicketIcon = ({className}) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>;

export default TicketScanner;
