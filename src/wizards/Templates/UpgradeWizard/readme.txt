-----------------------------------------------------------------------------------------------------------------
-                                       How to update the 'Items' folders                                       -
-----------------------------------------------------------------------------------------------------------------


1. Update files in the 'Web' folder

   Run the batch file 'CopyWebRepoFiles.bat'

2. Create/Update the Item.zip file located in this folder

   Run the batch file 'CreateTemplateZipFiles.bat'

3. Move the resulting zip file to it's final destination

   Run the batch file 'MoveTemplateZipFilesToFinalDestination.bat' 

4. Ensure the correct version of AccpacDotNetVersion.props has been 
   copied to the Upgrade Wizard ItemTemplates folder.

   Run the batch file 'CopyAccpacDotNetVersionSettings.bat'

5. The Upgrade Wizard can now be rebuilt with the latest Sage 300 
   Web Screen Framework source code!

Alternatively, you can just run 'RebuildAndDeployAll.bat' to execute all the above steps.

Note: To bypass the synchronization process (grabbing assets from the Columbus-Web folder),
      use the alternative batch file called 'NoWebSync_RebuildAndDeployAll.bat'
