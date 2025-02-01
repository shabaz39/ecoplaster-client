declare module 'india-pincode-lookup' {
    interface Location {
      officeName: string;
      pincode: string;
      taluk: string;
      districtName: string;
      stateName: string;
    }
  
    interface PincodeDirectory {
      lookup(pincode: string): Location[];
    }
  
    const pincodeDirectory: PincodeDirectory;
    export default pincodeDirectory;
  }